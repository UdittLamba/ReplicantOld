const {sequelize, getAccount, createRequester, getPost, insertSubmittedPost, setIsDone} = require('../db');
const dayjs = require('dayjs');

const farmKarmaJob = () => {
    sequelize.models.PostQueue.findAll(
        {
            where: {
                toBePostedAt: dayjs().hour(),
                isDone: false
            }
        }
    ).then((jobs) => {
        for (const job of jobs) {
            getAccount(job.dataValues.submitter).then((account) => {
                const requester = createRequester(account);
                getPost(job.dataValues.postId).then((post) => {
                    submitPost(post, requester).then(
                        insertSubmittedPost(job).then(() =>{
                            setIsDone(job.dataValues.postId, true);
                        }
                        )
                    );
                })
            }).catch((err) => console.log(err))
        }
    })
}

submitPost = (post, requester) => {
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
//farmKarmaJob();
module.exports = farmKarmaJob;