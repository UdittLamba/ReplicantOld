const {sequelize, getAccount, createRequester, getPost, insertSubmittedPost, setIsDone} = require('../db');
const dayjs = require('dayjs');
const {reportSubmission} = require('../comms/telegram/replicantMessenger');

/**
 * Job that posts on reddit through one of the randomly selected bot accounts
 * in order to farm karma.
 * @returns {Promise<void>}
 */
const farmKarmaJob = async () => {
    let jobs = null;
    jobs = await sequelize.models.PostQueue.findAll(
        {
            where: {
                toBePostedAt: dayjs().hour(),
                isDone: false
            }
        }
    );
    if (typeof jobs != 'undefined' && jobs != null && jobs.length > 0) {
        await farmKarma(jobs);
    }
}

/**
 * Iterate through job objects and post them on reddit.
 * @param jobs
 * @returns {Promise<void>}
 */
farmKarma = async (jobs) => {
    let account = null;
    for (const job of jobs) {
        account = await getAccount(job.dataValues.submitter);
        const requester = await createRequester(account);
        await executeSubmission(account, job, requester);
        await reportSubmission(job.dataValues.submitter);
    }
}

/**
 * Insert into
 * @param account
 * @param job
 * @param requester
 * @returns {Promise<void>}
 */
executeSubmission = async (account, job, requester) => {
    let post = null;
    post = await getPost(job.dataValues.postId);
    await recordSubmission(post, requester, job);

}

/**
 *
 * @param post
 * @param requester
 * @param job
 * @returns {Promise<void>}
 */
recordSubmission = async (post, requester, job) => {
    await submitPost(post, requester);
    await insertSubmittedPost(job);
    await setIsDone(job.dataValues.postId, true);
}

/**
 *
 * @param post
 * @param requester
 * @returns {Promise<Submission | void>}
 */
submitPost = async (post, requester) => {
    if (post.dataValues.url != null || '') {
        console.log(post.dataValues.subreddit);
        return requester.getSubreddit(post.dataValues.subreddit).submitLink({
            title: post.dataValues.title,
            url: post.dataValues.url
        }).catch((err) => console.log(err));
    }
    if (post.dataValues.isSelf === true && post.dataValues.edited === false) {
        console.log(post.dataValues.subreddit);
        return requester.getSubreddit(post.dataValues.subreddit).submitSelfPost({
            title: post.dataValues.title,
            text: post.dataValues.selfText
        }).catch((err) => console.log(err));
    }
}

module.exports = farmKarmaJob;