"use strict";
const Project = require("../models/projectSchema");

const projectController = {
  createAndSaveIssue: function (projectName, issue, done) {
    Project.findOneAndUpdate(
      { name: projectName },
      { $push: { issues: issue } },
      { upsert: true, new: true },
      (err, newIssue) => {
        if (err) return console.error(err);
        done(newIssue);
      }
    );
  },
  findAndUpdate: function () {
    // findAndUpdate logic
  },
  deleteIssue: function () {
    // delete issue logic
  },
};

module.exports = projectController;
