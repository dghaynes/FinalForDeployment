const Project = require('../models/projects');

module.exports = {};

module.exports.createProject = async (projectData) => {

    console.log("projectData:", projectData);

  //save project to database
  const project = await Project.create(projectData);
  return await project.save();
};

module.exports.updateProject = async (projectId, projectData) => {

   // console.log("projectId in DAO:", projectId)
   // console.log("DAO projectData:", projectData);


    const updatedProject = await Project.findByIdAndUpdate( {_id: projectId},
        {$push: {prompts: projectData}},
        {new: true});

    if(!updatedProject){
        throw new Error('Project not found');
    }

    return updatedProject;
};

module.exports.getProjects = async () => {
    return await Project.find().lean();
};

module.exports.getProjectsByUserId = async (userId) => {
    return await Project.find({ userId: userId });
  }

module.exports.getProjectById = async (projectId) => {

  //  console.log("projectId in DAO:", projectId);

   return await Project.findById({_id:projectId} );

};