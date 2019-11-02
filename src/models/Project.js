const dbPath = require('../services/database');
const fs = require('fs').promises;

class Project {
  constructor(body) {
    this.body = body;
    this.projects = [];
    this.errors = [];
  }

  index = async() => {
    this.projects = await fs.readFile(dbPath, 'utf-8');
    if (!this.projects) this.projects = '[]';
    this.projects = JSON.parse(this.projects);
    return this.projects;
  }

  show = async id => {
    this.checkIdExists(id);
    if (this.errors.length > 0) return;

    await this.index();
    id = Number(id);

    if (id > this.projects.length) return this.errors.push('Project do not exists.');
    return this.projects[id];
  }

  delete = async id => {
    if (!Number(id) && id != 0) return this.errors.push('ID must be a number');
    await this.index();
    id = Number(id);

    this.checkIdExists(id);
    if (this.errors.length > 0) return;

    const deletedItem = this.projects.splice(id, 1);

    console.log(deletedItem);

    this.save();
    return deletedItem;
  }

  checkIdExists = (id) => {
    id = Number(id);
    if (id > this.projects.length) return this.errors.push('Project do not exists.');
    if (typeof this.projects[id] === 'undefined') return this.errors.push('Project do not exists.');
  }

  update = async id => {
    await this.validate();
    await this.index();

    this.checkIdExists(id);

    if (this.errors.length > 0) return;

    id = Number(id);

    this.convertTagsToArray();

    this.projects.splice(id, 1, this.body);

    await this.save();
    return this.body;
  }

  create = async() => {
    await this.validate();
    if (this.errors.length > 0) return;

    await this.index();

    this.body.id = this.projects.length;

    this.convertTagsToArray();

    this.projects.push(this.body);

    await this.save();
    return this.body;
  }

  convertTagsToArray = () => {
    const tags = this.body.tags.split(',').map(val => val.trim());
    this.body.tags = tags;
  }

  save = async() => {
    this.reajustIds();
    await fs.writeFile(dbPath, JSON.stringify(this.projects, '', 2), { flag: 'w' });
  }

  reajustIds = () => {
    this.projects = this.projects.map((val, index) => {
      const newVal = { ...val };
      newVal.id = index;
      return newVal;
    });
  }

  validate = async() => {
    this.cleanUp();
    if (Number.isNaN(Number(this.body.id))) this.errors.push('ID must be a number');
    if (!this.body.tags) this.errors.push('tags is a required field.');
  }

  cleanUp = () => {
    for (const key in this.body) {
      if (typeof this.body[key] === 'undefined') {
        this.body[key] = '';
      }

      if (typeof this.body[key] !== 'string') {
        this.body[key] = String(this.body[key]);
      }
    }

    this.body = {
      id: this.body.id,
      name: this.body.name,
      tags: this.body.tags
    };
  }
}

module.exports = Project;
