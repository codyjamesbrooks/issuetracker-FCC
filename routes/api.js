"use strict";
const Project = require("../models/projectSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(function (req, res) {
      let project = req.params.project;
      Project.findOne({ name: project }, (err, projectDoc) => {
        if (err) return console.error(err);
        if (!projectDoc) return res.json([]); // project doesn't exist. respond with empty array of issues.

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
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
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
      if (!req.body._id) return res.json({ error: "missing _id" });
      if (Object.keys(req.body).length === 1)
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id,
        });

      Project.findOne({ name: project }, (err, projectDoc) => {
        if (err) return console.error(err);
        let issue = projectDoc.issues.id(req.body._id);

        if (issue) {
          for (const [key, value] of Object.entries(req.body)) {
            issue[key] = value;
          }

          issue.updated_on = new Date();
          projectDoc.save((err) => {
            if (err) return console.error(err);
            return res.json({
              result: "sucessfully updated",
              _id: req.body._id,
            });
          });
        } else {
          res.json({ error: "could not update", _id: req.body._id });
        }
      });
    })

    .delete(function (req, res) {
      let project = req.params.project;
      if (!req.body._id) return res.json({ error: "missing _id" });

      Project.findOneAndUpdate(
        { name: project },
        { $pull: { issues: { _id: req.body._id } } },
        { useFindAndModify: false },
        (err, projectDocBeforePull) => {
          if (err) return console.error(err);

          let deletedIssue = projectDocBeforePull.issues.id(req.body._id);

          if (deletedIssue) {
            return res.json({
              result: "successfully deleted",
              _id: req.body._id,
            });
          } else {
            return res.json({ error: "could not delete", _id: req.body._id });
          }
        }
      );
    });
};
