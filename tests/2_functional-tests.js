const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let createdTestIssues = [];

suite("Functional Tests", function () {
  suite("POST request to /api/issues/{project}", function () {
    const testObject = {
      issue_title: "TestTitle1",
      issue_text: "TestIssueText1",
      created_by: "TestUser1",
      assigned_to: "TestAssignedUser1",
      status_text: "TestStatus1",
    };
    test("create an issue with every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/testSuite")
        .send(testObject)
        .end(function (err, res) {
          assert.equal(res.status, 200, "incorrect server res");
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "TestTitle1");
          assert.equal(res.body.issue_text, "TestIssueText1");
          assert.equal(res.body.created_by, "TestUser1");
          assert.equal(res.body.assigned_to, "TestAssignedUser1");
          assert.equal(res.body.status_text, "TestStatus1");
          createdTestIssues.push(res.body);
          done();
        });
    });
    const testObjRequired = {
      issue_title: "TestTitle2",
      issue_text: "TestIssueText2",
      created_by: "TestUser2",
    };
    test("create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/testSuite")
        .send(testObjRequired)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.issue_title, "TestTitle2");
          assert.equal(res.body.issue_text, "TestIssueText2");
          assert.equal(res.body.created_by, "TestUser2");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          createdTestIssues.push(res.body);
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
        .post("/api/issues/testSuite")
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
      chai
        .request(server)
        .get("/api/issues/testSuite")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body, "body of response is not an array");
          assert.equal(res.body.length, 2);
          done();
        });
    });
    test("view issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/testSuite?created_by=TestUser1")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body, "body of response is not an array");
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].created_by, "TestUser1");
          done();
        });
    });
    test("view issues on a project with two filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/testSuite?created_by=TestUser1&status_text=Invalid")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body, "body of response is not an array");
          assert.equal(res.body.length, 0);
          done();
        });
    });
  });
  suite("DELETE request to /api/issues/{project}", function () {
    test("delete 1st test issue using valid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/testSuite")
        .send({ _id: createdTestIssues[0]._id })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, createdTestIssues[0]._id);
          done();
        });
    });
    test("send invalid _id with delete request", function (done) {
      chai
        .request(server)
        .delete("/api/issues/testSuite")
        .send({ _id: createdTestIssues[0]._id })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, createdTestIssues[0]._id);
          done();
        });
    });
    test("delete 2nd test issue using valid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/testSuite")
        .send({ _id: createdTestIssues[1]._id })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, createdTestIssues[1]._id);
          done();
        });
    });
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test("send delete request missing _id parameter", function (done) {
      chai
        .request(server)
        .delete("/api/issues/testSuite")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("validate that all test issues were deleted", function (done) {
      chai
        .request(server)
        .get("/api/issues/testSuite")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          assert.equal(res.body.length, 0);
          done();
        });
    });
  });
});
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
