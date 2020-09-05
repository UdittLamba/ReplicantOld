const { Sequelize, DataTypes, Model } = require('sequelize');
const snoowrap = require('snoowrap');
const Account = require('../models/Account');
const Subreddit = require('../models/Subreddit');

const subredditUpdatorJob = () => {
    const account = Account.findByPk(1).then((account) => {
        //console.log(account.dataValues.userAgent);
        const requester = new snoowrap({
            userAgent: account.dataValues.userAgent,
            clientId: account.dataValues.clientId,
            clientSecret: account.dataValues.clientSecret,
            username: account.dataValues.username,
            password: account.dataValues.password
        });
        requester.getHot().map(post => post.subreddit_name_prefixed).then((subreddits) =>{
            for (const subredditName of subreddits) {
                console.log(subredditName);
                // Subreddit.findOrCreate({
                //     where: { name: subredditName.substring(2, subredditName.length) }
                // });

            }
        });
    });
}

subredditUpdatorJob();
module.exports = subredditUpdatorJob;