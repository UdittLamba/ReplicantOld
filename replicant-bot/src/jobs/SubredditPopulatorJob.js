const snoowrap = require('snoowrap');
const Account = require("../models/Account");
const Subreddit = require('../models/Subreddit');

const subredditPopulatorJob = () => {
    Account.findOne().then((account) => {// any reddit account will do.
        const requester = new snoowrap({
            userAgent: account.dataValues.userAgent,
            clientId: account.dataValues.clientId,
            clientSecret: account.dataValues.clientSecret,
            username: account.dataValues.username,
            password: account.dataValues.password
        });
        requester.getHot().map(post => post.subreddit_name_prefixed).then((subreddits) =>{
            for (const subredditName of subreddits) {
                Subreddit.findOrCreate({
                    where: { name: subredditName.substring(2, subredditName.length) }
                });
            }
        });
    });
}

//subredditPopulatorJob();//temp execution
module.exports = subredditPopulatorJob;