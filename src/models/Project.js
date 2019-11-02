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

  show = async(id) => {
    if (!Number(id)) return this.errors.push('ID must be a number');
  }

  create = async() => {
    await this.validate();
    if (this.errors.length > 0) return;

    await this.index();

    this.body.id = this.projects.length;

    const tags = this.body.tags.split(',').map(val => val.trim());
    this.body.tags = tags;

    this.projects.push(this.body);

    await this.save();
    return this.body;
  }

  save = async() => {
    await fs.writeFile(dbPath, JSON.stringify(this.projects, '', 2), { flag: 'w' });
  }

  validate = () => {
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
