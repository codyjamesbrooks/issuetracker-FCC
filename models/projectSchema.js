const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  createdBy: { type: String, required: true },
  assignedTo: String,
  status: String,
});

const projectSchema = new Schema({
  name: { type: String, required: true },
  issues: [issueSchema],
});

module.exports = mongoose.model("ProjectSchema", projectSchema);
