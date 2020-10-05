const serverless = require('serverless-http');
const express = require('express');
const account = require('Replicant/db');
const app = express();
const acc = new account();

// API endpoints go here.
app.get('/accounts/all', function (req, res) {
    acc.fetchAllAccounts().then( (accounts) => {
        res.json(accounts);
    })
})

module.exports.apiHandler = serverless(app);