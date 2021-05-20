const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST request to /api/issues/{project}", function () {
    const testObject = {
      issue_title: "TestTitle",
      issue_text: "TestIssueText",
      created_by: "TestUser",
      assigned_to: "TestAssignedUser",
      status_text: "TestStatus",
    };
    test("create an issue with every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testObject)
        .end(function (err, res) {
          assert.equal(res.status, 200, "incorrect server res");
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "TestTitle");
          assert.equal(res.body.issue_text, "TestIssueText");
          assert.equal(res.body.created_by, "TestUser");
          assert.equal(res.body.assigned_to, "TestAssignedUser");
          assert.equal(res.body.status_text, "TestStatus");
          done();
        });
    });
    const testObjRequired = {
      issue_title: "TestTitle",
      issue_text: "TestIssueText",
      created_by: "TestUser",
    };
    test("create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testObjRequired)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "TestTitle");
          assert.equal(res.body.issue_text, "TestIssueText");
          assert.equal(res.body.created_by, "TestUser");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    const testObjNoTitle = {
      issue_text: "TestIssueText",
      created_by: "TestUser",
    };
    test("create an issue with missing required fields (error response)", function (done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testObjNoTitle)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("GET request to /api/issues/{project}", function () {
    test("view issues on a project", function (done) {
      chai.request(server).get("/api/issues/apitest");
    });
  });
});

// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
