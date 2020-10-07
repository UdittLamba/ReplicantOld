const {sequelize} = require('../db');
const dayjs = require('dayjs');
const {Op, Sequelize} = require('sequelize');

const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

const pickRandomHour = () => {
    return randomNumber(12, 23);
}

/**
 * Takes random number of accounts and generate random scheduled posts
 * for each account as per the input to the function.
 *
 * Accounts MUST be incubated for 1 week min.
 * Selected posts MUST be atleast a month old.
 *
 * @param numOfAccounts
 * @param numOfPosts
 */
const schedulePostJobs = (numOfAccounts, numOfPosts) => {
    sequelize.models.Account.findAll({
        order: Sequelize.literal('rand()'),
        where: {
            isSold: false,
            isSuspended: false,
            createdAt: {
                [Op.lte]: dayjs().subtract(7, 'day')['$d']
            }
        },
        limit: numOfAccounts
    }).then((submitters) => {
        for (const submitter of submitters) {
            sequelize.models.Post.findAll(
                {
                    order: Sequelize.literal('rand()'),
                    where: {
                        createdAt: {
                            [Op.lte]: dayjs().subtract(24, 'day')['$d']
                        }
                    },
                    limit: numOfPosts
                }
            ).then((posts) => {
                for (const post of posts) {
                    sequelize.models.PostQueue.findOrCreate({
                        where: {
                            postId: post.dataValues.id,
                            postName: post.dataValues.name,
                            submitter: submitter.dataValues.username,
                            toBePostedAt: pickRandomHour()
                        }
                    }).catch((err) => console.log(err))
                }
            })
        }
    })
}
//schedulePostJobs(2,3);
module.exports = schedulePostJobs;