const {Router} = require('express');
require('dotenv').config();
const router = Router();
const Project = require('../DAO/project');
const {BedrockRuntimeClient, InvokeModelCommand} = require('@aws-sdk/client-bedrock-runtime');
const mongoose = require('mongoose')
const {authenticate, hasRole} = require('../middleware/authMiddleware');

//make sure all users are authorized
router.use(authenticate);

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

//only admin can get all projects
// get /chat/projects
router.get('/projects', hasRole('user','admin'), async (req, res) => {

    try{

        const isAdmin = req.user.roles.includes('admin');

        if(isAdmin){
            const projects = await Project.getProjects();
            return res.status(200).json(projects);
        }else{

            const projects = await Project.getProjectsByUserId();
            res.status(200).json(projects);

        }


    }catch(err){
        console.error("Error getting projects: ", err);
        res.status(500).json({error: "Failed to get projects"});
    }

});

//get project by id
router.get('/projects/:id', async (req, res) => {

    const { id } = req.params


    console.log("ProjectId: ", id);

    console.log("userId ", req.user._id);



    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Invalid project ID"});
    }

    try{

        const project = await Project.getProjectById(id);

        if(!project){
            console.log("Project not found");
            return res.status(404).json({error: "Project not found"});
        }

        //only user can access his specific project
        if(project.userId.toString() !== req.user._id.toString()){
            console.log("User not authorized to access this project");
            return res.status(403).json({error: "User not authorized to access this project"});
        }

        res.status(200).json(project);

    }catch(err){

        console.error("Error getting project: ", err);
        res.status(500).json({error: "Failed to get project"});
    }

});


//Create a new project
router.post('/create-project', async (req, res) => {
    const { user } = req.body;

    console.log("Request Body: ", req.body);
    console.log("UserId: ", user);


    if (!user) {
        return res.status(400).json({error: "UserId is required"});
    }

    try {
        const project = await Project.createProject( {userId : user} );
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({error: "Failed to create project"});
    }
});



//Add a prompt using Bedrock response
router.post('/projects/:id/prompts', async (req, res) => {

    const {id} = req.params;
    const prompt = {
        "type": req.body.type,
        "text": req.body.text
    }

    //validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Invalid project ID"});
    }

    if (!prompt ){
        return res.status(400).json({error: "Prompt is required"});
    }

    const modelId ='anthropic.claude-3-5-sonnet-20240620-v1:0';

    const input = {
        body: JSON.stringify({
            messages : [ { role: 'user', content: [prompt] }], //claude 3 models use a message array with role based formating
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            top_k: 250,
            stop_sequences: [],
            anthropic_version: "bedrock-2023-05-31",
        }),
        modelId: modelId,
        contentType: 'application/json',
        accept: 'application/json'
    }

    try{
        //call bedrock with text
        const command = new InvokeModelCommand(input);

        const response = await client.send(command); //invoke Bedrock

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        //Add the prompt and response to the project
        const updatedProject = await Project.updateProject(id,
            {prompt: req.body.text,
                response: responseBody.content?.[0]?.text || 'No response generated.'}
        );

        res.status(200).json({ output: responseBody.content?.[0]?.text || 'No response generated.'});
    }catch(err){

        console.error("Error adding prompt: ", err);
        res.status(500).json({error: "Failed to add prompt"});
    }

});

//Handle Requests  - endpoint to process text generation
router.post('/llm', async (req, res) => {

    const prompt = {
        "type": req.body.type,
        "text": req.body.text
    };

   // console.log("Prompt: ", prompt);

    const modelId ='anthropic.claude-3-5-sonnet-20240620-v1:0';

    if (!prompt ){
        return res.status(400).json({error: "Prompt is required"});
    }

    //invoke Bedrock
    const input = {
        body: JSON.stringify({
            messages : [ { role: 'user', content: [prompt] }], //claude 3 models use a message array with role based formating
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 1,
            top_k: 250,
            stop_sequences: [],
            anthropic_version: "bedrock-2023-05-31",
        }),
        modelId: modelId,
        contentType: 'application/json',
        accept: 'application/json'
    }

    try{
        const command = new InvokeModelCommand(input);

        const response = await client.send(command); //invoke Bedrock

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        res.status(200).json({ output: responseBody.content?.[0]?.text || 'No response generated.'});

    }catch(err){
        console.log("Error updating project with prompt", err);
        res.status(500).json({error: "Failed to Generate Text"});
    }

});




//update project
router.post('/update-project/:id/prompts', async (req, res) => {

   const {id} = req.params;
    const { prompt, response} = req.body;

  //  console.log("ProjectId: ", id);
  //  console.log("Prompt: ", prompt);
   // console.log("Response: ", response);

    //validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Invalid project ID"});
    }

    //validate prompt
    if (!prompt || !response) {
        return res.status(400).json({error: "Prompt and Response are required"});
    }

    try{

        const upDatedProject = await Project.updateProject(id,
            { prompt: prompt, response: response }
        );

        res.status(200).json(upDatedProject);

    }catch(err){
        if(err.message === 'Invalid Project ID'){
            return res.status(404).json({error: err.message});
        } else if (err.message === 'Project not found'){
            return res.status(404).json({error: err.message});
        }else{
            console.error("Error updating project: ", err);
            res.status(500).json({error: "server error"});
        }
    }

});


module.exports = router;
