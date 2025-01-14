const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  open: { type: Boolean, default: true },
  assigned_to: String,
  status_text: String,
});

const projectSchema = new Schema({
  name: { type: String, required: true },
  issues: [issueSchema],
});

module.exports = mongoose.model("ProjectSchema", projectSchema);
