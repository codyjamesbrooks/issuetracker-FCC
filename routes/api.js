"use strict";
const Project = require("../models/projectSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
      Project.findOne({ name: project }, (err, projectDoc) => {
        if (err) return console.error(err);
        if (!projectDoc) return res.json([]); // project

        let issues = projectDoc.issues;
        Object.keys(req.query).forEach((key) => {
          issues = issues.filter((issue) => issue[key] === req.query[key]);
        });

        res.json(issues);
      });
    })

    .post(function (req, res) {
      let project = req.params.project;

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }

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
          res.json(newIssue);
        }
      );
    })

    .put(function (req, res) {
      let project = req.params.project;

      const updateObject = Object.keys(req.body).reduce((acc, key) => {
        const _acc = acc;
        if (req.body[key] && key !== "_id") _acc[key] = req.body[key];
        return _acc;
      }, {});
      updateObject.updated_on = new Date();

      Project.findOne({ name: project }, (err, projectDoc) => {
        if (err) return console.error(err);
        let issue = projectDoc.issues.id(req.body._id);
        Object.keys(updateObject).forEach(
          (key) => (issue[key] = updateObject[key])
        );
        res.json({ result: "sucessfully updated", _id: issue._id });
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.send({ error: "missing _id" });

      Project.findOneAndUpdate(
        { name: project },
        { $pull: { issues: { _id: req.body._id } } },
        { new: true, useFindAndModify: false },
        (err, newProject) => {
          if (err) return console.error(err);
          res.json({ result: "successfully deleted", _id: req.body._id });
        }
      );
    });
};
