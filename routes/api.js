"use strict";
const Project = require("../models/projectSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
      console.log(project);
      Project.findOne({ name: project }, (err, projectDoc) => {
        if (err) return console.error(err);
        res.send(projectDoc.issues);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      };
      Project.findOneAndUpdate(
        { name: project },
        { $push: { issues: issue } },
        { upsert: true, new: true, useFindAndModify: false },
        (err, updatedProject) => {
          if (err) return console.error(err);
          let newIssue = updatedProject.issues.slice(-1)[0];
          res.send(newIssue);
        }
      );
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
