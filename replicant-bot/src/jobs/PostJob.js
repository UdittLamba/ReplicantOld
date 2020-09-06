const snoowrap = require('snoowrap');
const {Account, pickAccounts} = require("../models/Account");
const Post = require('../models/Post');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    ,{
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

const postJob = (numberOfAccounts) => {
    pickAccounts(numberOfAccounts).then((accounts) => {
        for(const account of accounts){
            const poster = new snoowrap({
                userAgent: account.dataValues.userAgent,
                clientId: account.dataValues.clientId,
                clientSecret: account.dataValues.clientSecret,
                username: account.dataValues.username,
                password: account.dataValues.password
            });

            Post.findOne({order: sequelize.random()}).then((post) => {
                if(post.dataValues.url != null || ''){
                    poster.getSubreddit(post.dataValues.subreddit).submitLink({
                        title: post.dataValues.title,
                        url: post.dataValues.url
                    }).catch((err) => console.log(err));
                }
                if(post.dataValues.isSelf == true && post.dataValues.edited == false ){
                    poster.getSubreddit(post.dataValues.subreddit).submitSelfPost({
                        title: post.dataValues.title,
                        text: post.selfText
                    }).catch((err) => console.log(err));
                }
            }).catch((err) => {console.log(err)});

        }
    }).catch((err) => console.log(err));
}

module.exports = postJob;