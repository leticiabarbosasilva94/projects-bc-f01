const Project = require('../models/Project');

exports.index = async(req, res) => {
  const project = new Project();
  const projects = await project.index();
  res.send(projects);
};

exports.create = async(req, res) => {
  const project = new Project(req.body);
  const createdProject = await project.create();

  if (project.errors.length > 0) return res.status(400).json(project.errors);
  res.json(createdProject);
};

exports.show = async(req, res) => {
  if (!req.params.id) return res.status(400).json('Error');
  const project = new Project();
  const showProject = await project.show(req.params.id);

  if (project.errors.length > 0) return res.status(400).json(project.errors);
  res.json(showProject);
};
