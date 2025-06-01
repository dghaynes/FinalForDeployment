const request = require("supertest");
var jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const server = require("../server");
const Project = require("../DAO/project");
const User = require("../DAO/user");
const UserModel = require("../models/user");
const ProjectModel = require("../models/projects");
const {createUser} = require("../DAO/user");
const {Mongoose} = require("mongoose");


describe("Before Login", () => {

    const user0 = {
        email: "drakas@proton.me",
        password: "WinstonChurchillRules"
    }

    const user1 = {
        email: "dghaynes@proton.me",
        password: "acjy3b8m"
    }

    //creates a user
    it('signs up a new user', async ()=> {

        console.log("in test  - sending email and password", user0.email, user0.password);

        const res = await request(server)
            .post('/user/signup')
            .send({email: user0.email, password: user0.password});

        expect(res.status).toBe(201);
        console.log("response body", res.body);
        expect(res.body.message).toMatch("User created successfully");
    });

    it('rejects login with invalid credentials', async () => {
        const res = await request(server)
            .post('/user/login')
            .send(user1);

        expect(res.status).toBe(401);
        expect(res.body.error).toMatch("Error logging in: User not found");
    });

});



/*
describe('User Routes', () => {


    const user0 = {
        email: "drakas@proton.me",
        password: "WinstonChurchillRules"
    }

    const user1 = {
        email: "dghaynes",
        password: "acjy3b8m"
    }

    it('signs up a new user', async ()=> {
        const res = await request(server)
            .post('/user/signup')
            .send(user0);

        expect(res.status).toBe(201);
        console.log("response body", res.body);
        expect(res.body.message).toMatch("User created successfully");
    });

    it('logs in and returns a token', async () => {
        const res = await request(server)
            .post('/user/login')
            .send(user0);

        console.log("response body", res.body);

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();

    });

    it('rejects login with invalid credentials', async () => {
        const res = await request(server)
            .post('/user/login')
            .send(user1);

        expect(res.status).toBe(401);
        expect(res.body.error).toMatch("Error logging in: User not found");
    });

});
*/


//mock bedrock client
jest.mock('../utils/bedrockClient', () => ({
    getResponse : jest.fn().mockResolvedValue('Mocked response'),
}));


const createAuthToken = (user) => {

    if (!user) user = {
        _id: new mongoose.Types.ObjectId(),
        email: "darakas@proton.me",
        password: "WinstonRules",
        roles: ["admin"]
    };

   // console.log("user:", user);

    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  };



describe("After Login",  () =>{

    describe('POST /chat/create-projects', () => {

        it('should allow a user to create a project', async ()=>{

            const token = createAuthToken();
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded._id;

            //  console.log("test userId:", userId);

            const res = await request(server)
                .post(`/chat/create-project`)
                .set('Authorization', `Bearer ${token}`)
                .send({user:userId});

            expect(res.status).toBe(201);
        });

        it('should reject request if not authenticated', async ()=>{
            const res = await request(server)
                .post('/chat/create-project')
                .send({ userId:  new mongoose.Types.ObjectId(), prompts: []});

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized - No token provided');
        });


    });

    describe('POST /chat/projects/:id/prompts', () => {

        it('should allow authenticated request add a prompt to a project', async ()=>{
            const token = createAuthToken();
            //Create Project
            const project = await Project.createProject({ userId:  new mongoose.Types.ObjectId(), prompts: []});
            console.log("projectID:", project._id)

            //send the prompt to the route
            const res = await request(server)
                .post(`/chat/projects/${project._id}/prompts`).set(
                    'Authorization', `Bearer ${token}`
                )
                .send({ type: "text",
                "text": "Hello Ai"});

            expect(res.status).toBe(200);
            console.log("res.body:", res.body.output);
            expect(res.body.output).toMatch('Hello! How can I assist you today? Feel free to ask me any questions or let me know if you need help with anything.');
        });

        it('should reject request if not authenticated', async ()=>{
            const project = await Project.createProject({ userId:  new mongoose.Types.ObjectId(), prompts: []});

            //send the prompt to the route
            const res = await request(server)
                .post(`/chat/projects/${project._id}/prompts`)
                .send({ prompt: "Failing Prompt" });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized - No token provided');
        });

        it('should reject request with invalid token', async ()=> {
            const project = await Project.createProject({ userId:  new mongoose.Types.ObjectId(), prompts: []});

            const res = await request(server)
                .post(`/chat/projects/${project._id}/prompts`)
                .set('Authorization', 'Bearer invalidtoken123')
                .send({ type: "text",
                    "text": "Should Fail" });

            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Unauthorized - Invalid token');
        });

        it('should reject request with invalid project id', async ()=> {
            const token = createAuthToken();
            const res = await request(server)
                .post(`/chat/projects/123/prompts`).set(
                    'Authorization', `Bearer ${token}`
                )
                .send({ type: "text",
                    "text": "Should Fail" });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid project ID');
        });

        it('should update a project with a new prompt', async ()=> {

            const prompt1 = {
                "prompt": "What is the difference between AI and ML?",
                "response": "AI (Artificial Intelligence) and ML (Machine Learning) are related concepts but have distinct differences:\n\n1. Definition:\n   - AI: The broader concept of creating intelligent machines that can simulate human-like thinking and behavior.\n   - ML: A subset of AI that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience.\n\n2. Scope:\n   - AI: Encompasses a wide range of techniques and approaches to create intelligent systems.\n   - ML: Specifically deals with the ability of systems to learn from data without being explicitly programmed.\n\n3. Approach:\n   - AI: Can involve rule-based systems, expert systems, and other approaches that don't necessarily require learning from data.\n   - ML: Relies on data-driven approaches to identify patterns and make decisions.\n\n4. Functionality:\n   - AI: Aims to create systems that can perform tasks requiring human-like intelligence, such as reasoning, problem-solving, and natural language processing.\n   - ML: Focuses on creating models that can recognize patterns, make predictions, or take actions based on input data.\n\n5. Autonomy:\n   - AI: Can potentially operate autonomously in complex environments.\n   - ML: Typically requires human intervention to define the problem, prepare data, and interpret results.\n\n6. Types of problems:\n   - AI: Can address a wide range of problems, including those that are not well-defined or structured.\n   - ML: Works best with well-defined problems where large amounts of data are available.\n\n7. Historical context:\n   - AI: Has been a field of study since the 1950s.\n   - ML: Gained prominence more recently, especially with the advent of big data and increased computing power.\n\n8. Adaptability:\n   - AI: Can potentially adapt to new situations using general intelligence.\n   - ML: Adapts within the scope of its training data and predefined parameters.\n\nIn summary, AI is a broader concept that aims to create intelligent machines, while ML is a specific approach within AI that focuses on enabling systems to learn from data. ML is a key driver of many recent AI advancements, but AI also encompasses other approaches and techniques beyond ML."
            }


            const token = createAuthToken();
            const project = await Project.createProject({ userId:  new mongoose.Types.ObjectId(), prompts: []});

            const res = await request(server)
                .post(`/chat/update-project/${project._id}/prompts`).set(
                    'Authorization', `Bearer ${token}`
                )
                .send(prompt1);

            expect(res.status).toBe(200);

        });

    });

    describe('GET /chat/projects', () => {

        let userDecoded, adminDecoded, adminToken, userToken, project1, project2;

        beforeEach(async () => {

            adminToken = createAuthToken();
            adminDecoded = jwt.verify(adminToken, process.env.JWT_SECRET);


            userToken = createAuthToken({_id: new mongoose.Types.ObjectId(), email: "dghaynes@proton.me", password: "I like mosa", roles: ["user"]});
            userDecoded = jwt.verify(userToken, process.env.JWT_SECRET);

            console.log("userDecoded:", userDecoded._id);
            console.log("adminDecoded:", adminDecoded._id);

            project1 = await Project.createProject({ userId:  userDecoded._id, prompts: []});
            project2 = await Project.createProject({ userId:  adminDecoded._id, prompts: []});


        });

        it('should return all projects for admin role', async () => {

            console.log("adminToken:", adminDecoded);
            console.log('decoded user token', userDecoded);

            const res =  await request(server)
                .get('/chat/projects')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

        });

        it('should return projects for a specific user', async () => {

            const res =  await request(server)
                .get('/chat/projects')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

        });

    });




});









