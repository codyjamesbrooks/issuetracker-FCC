"use strict";
const projectController = require("../controllers/projectController");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      let issue = {
        title: req.body.issue_title,
        test: req.body.issue_text,
        createdBy: req.body.created_by,
        assignedTo: req.body.assigned_to,
        status: req.body.status_text,
      };
      console.log(project, issue);
      projectController.createAndSaveIssue(project, issue, console.log);
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
