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
            isHarvested: false,
            postKarma: {
                [Op.lte]: 20000
            },
            createdAt: {
                [Op.lte]: dayjs().subtract(20, 'day')['$d']
            }
        },
        limit: numOfAccounts
    })
    await assignPost(selectedAccounts, numOfPosts);
}

/**
 * Assign <numberOfPosts> posts to selected submitters.
 *
 * @param submitters
 * @param numOfPosts
 * @returns {Promise<void>}
 */
assignPost = async (submitters, numOfPosts) => {
    let posts = null;
    for (const submitter of submitters) {
        posts = await sequelize.models.Post.findAll(
            {

                order: Sequelize.literal('rand()'),
                where: {
                    createdAt: {
                        [Op.lte]: dayjs().subtract(30, 'day')['$d']
                    }
                },
                limit: numOfPosts
            }
        )
        await schedulePosts(posts, submitter)
    }
}

/**
 * Insert into table PostQueues.
 * @param posts
 * @param submitter
 * @returns {Promise<void>}
 */
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

module.exports = schedulePostJobs;