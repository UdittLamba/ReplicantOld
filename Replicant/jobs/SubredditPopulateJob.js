const snoowrap = require('snoowrap');
const {sequelize} = require('../db');

/**
 * Populate the Subreddit table with subreddits whose posts made to the top of the day.
 */
const subredditPopulateJob = () => {
    sequelize.models.Account.findOne(
        {
            where: {
                isSuspended: false,
                isSold: false
            }
        }).then((account) => {// any reddit account will do.
        const requester = new snoowrap({
            userAgent: account.dataValues.userAgent,
            clientId: account.dataValues.clientId,
            clientSecret: account.dataValues.clientSecret,
            username: account.dataValues.username,
            password: account.dataValues.password
        });
        // requester.getPopularSubreddit()./*map(sub => sub.display_name_prefixed).*/then((subreddits) => {
        //     for (const subredditName of subreddits) {
        //         sequelize.models.Subreddit.findOrCreate({
        //             where: {name: subredditName.substring(2, subredditName.length)}
        //         }).catch(console.error);
        //     }
        // }).catch(console.error);
        requester.getTop({time: 'day'}).map(post => post.subreddit_name_prefixed).then((subreddits) => {
            for (const subredditName of subreddits) {
                sequelize.models.Subreddit.findOrCreate({
                    where: {name: subredditName.substring(2, subredditName.length)}
                }).catch(console.error);
            }
        }).catch(console.error);
    });
}

subredditPopulateJob();//temp execution
module.exports = subredditPopulateJob