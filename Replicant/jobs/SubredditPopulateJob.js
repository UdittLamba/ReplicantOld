const {sequelize, createRequester} = require('../db');

/**
 * Populate the Subreddit table with subreddits whose posts made to the top of the day.
 */
const subredditPopulateJob = async () => {
    let account = null;
    //await sequelize.connectionManager.initPools();
    try {
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
    }catch(err){
        console.log(err);
    }
}

update = async (account) => {// any reddit account will do.
    let subreddits = null;
     requester = await createRequester(account);
    subreddits = await requester.getTop({time: 'day'}).map(post => post.subreddit_name_prefixed);
    await insertSubreddit(subreddits);
}

insertSubreddit = async (subreddits) => {
    for (const subredditName of subreddits) {
        await sequelize.models.Subreddit.findOrCreate({
            where: {name: subredditName.substring(2, subredditName.length)}
        })
    }
}

//subredditPopulateJob().catch();//temp execution
module.exports = subredditPopulateJob