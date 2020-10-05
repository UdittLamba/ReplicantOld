const snoowrap = require('snoowrap');
const {Account, pickAccounts} = require("../db");
const Post = require('../models/Post');
const Sequelize  = require('sequelize');

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    ,{
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

const postJob = (numberOfAccounts) => {
    pickAccounts(numberOfAccounts).then((accounts) => {
        for(const account of accounts){
            const poster = new snoowrap({
                userAgent: account.userAgent,
                clientId: account.clientId,
                clientSecret: account.clientSecret,
                username: account.username,
                password: account.password
            });

            Post.findOne({order: sequelize.random()}).then((post) => {
                if(post.url != null || ''){
                    poster.getSubreddit(post.subreddit).submitLink({
                        title: post.title,
                        url: post.url
                    }).catch((err) => console.log(err));
                }
                if(post.dataValues.isSelf == true && post.dataValues.edited == false ){
                    poster.getSubreddit(post.subreddit).submitSelfPost({
                        title: post.title,
                        text: post.selfText
                    }).catch((err) => console.log(err));
                }
            }).catch((err) => {console.log(err)});

        }
    }).catch((err) => console.log(err));
}

module.exports = postJob;