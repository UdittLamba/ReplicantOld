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
 * Accounts MUST be incubated for 1 week min although ideally it should be incubated for a month.
 * Selected posts MUST be atleast a month old.
 *
 * @param numOfAccounts
 * @param numOfPosts
 */
const schedulePostJobs = async (numOfAccounts, numOfPosts) => {
    let selectedAccounts = null;
    selectedAccounts = await sequelize.models.Account.findAll({
        order: Sequelize.literal('rand()'),
        where: {
            isSold: false,
            isSuspended: false,
            createdAt: {
                [Op.lte]: dayjs().subtract(7, 'day')['$d']
            }
        },
        limit: numOfAccounts
    })
    await assignPost(selectedAccounts, numOfPosts);
}

assignPost = async (submitters, numOfPosts) => {
    let posts = null;
    for (const submitter of submitters) {
        posts = await sequelize.models.Post.findAll(
            {
                order: Sequelize.literal('rand()'),
                where: {
                    createdAt: {
                        [Op.lte]: dayjs().subtract(24, 'day')['$d']
                    }
                },
                limit: numOfPosts
            }
        )
        await schedulePosts(posts, submitter)
    }
}

schedulePosts = async (posts, submitter) => {
    for (const post of posts) {
        await sequelize.models.PostQueue.findOrCreate({
            where: {
                postId: post.dataValues.id,
                postName: post.dataValues.name,
                submitter: submitter.dataValues.username,
                toBePostedAt: pickRandomHour()
            }
        }).catch((err) => console.log(err))
    }
}
//schedulePostJobs(1,1).catch();
module.exports = schedulePostJobs;