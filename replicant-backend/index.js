const serverless = require('serverless-http');
const express = require('express');
const {fetchAllAccounts, fetchAllSubreddits} = require('./db');
const app = express();

// API endpoints go here.
app.get('/accounts/all', function(req, res) {
  fetchAllAccounts().then((accounts) => {
    res.json(accounts);
  });
});

app.get('/subreddits/all', function(req, res) {
  fetchAllSubreddits().then((subreddits) => {
    res.json(subreddits);
  });
});

module.exports.apiHandler = serverless(app);
