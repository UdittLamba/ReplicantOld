const {sequelize, getAccount, createRequester, getPost, insertSubmittedPost, setIsDone} = require('../db');
const dayjs = require('dayjs');
const {reportSubmission} = require('../comms/telegram/replicantMessenger');

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

farmKarma = async (jobs) => {
    let account = null;
    for (const job of jobs) {
        account = await getAccount(job.dataValues.submitter);
        const requester = await createRequester(account);
        await executeSubmission(account, job, requester);
        await reportSubmission(job.dataValues.submitter);
    }
}
executeSubmission = async (account, job, requester) => {
    let post = null;
    post = await getPost(job.dataValues.postId);
    await recordSubmission(post, requester, job);

}

recordSubmission = async (post, requester, job) => {
    await submitPost(post, requester);
    await insertSubmittedPost(job);
    await setIsDone(job.dataValues.postId, true);
}
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