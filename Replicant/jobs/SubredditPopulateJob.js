const snoowrap = require('snoowrap');
const {sequelize} = require('../db');

/**
 * Populate the Subreddit table with subreddits whose posts made to the top of the day.
 */
const subredditPopulateJob = async () => {
    let account = null;
    //await sequelize.connectionManager.initPools();
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
        delete sequelize.connectionManager.getConnection;
    }
    account = await sequelize.models.Account.findOne(
        {
            where: {
                isSuspended: false,
                isSold: false
            }
        });
    await update(account);
}

update = (async (account) => {// any reddit account will do.
    let subreddits = null;
    console.log('in update');
    const requester = await new snoowrap({
        userAgent: account.dataValues.userAgent,
        clientId: account.dataValues.clientId,
        clientSecret: account.dataValues.clientSecret,
        username: account.dataValues.username,
        password: account.dataValues.password
    });
    subreddits = await requester.getTop({time: 'day'}).map(post => post.subreddit_name_prefixed);
    await insertSubreddit(subreddits);
})

insertSubreddit = async (subreddits) => {
    for (const subredditName of subreddits) {
        await sequelize.models.Subreddit.findOrCreate({
            where: {name: subredditName.substring(2, subredditName.length)}
        }).catch(console.error);
    }
}

//subredditPopulateJob().catch();//temp execution
module.exports = subredditPopulateJob