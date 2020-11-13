const { sequelize, createRequester } = require('../db')

/**
 * Populate the Subreddit table with subreddits whose posts made
 * to the top of the day.
 * @return {Promise<boolean>}
 */
const subredditPopulateJob = async () => {
  const account = await sequelize.models.Account.findOne(
    {
      where: {
        isSuspended: false,
        isShadowBanned: false,
        isSold: false
      }
    })
  return await update(account)
}

/**
 *
 * @param {string[]} subreddits
 * @return {Promise<boolean>}
 */
const insertSubreddit = async (subreddits) => {
  for (const subredditName of subreddits) {
    await sequelize.models.Subreddit.findOrCreate({
      where: { name: subredditName.substring(2, subredditName.length) }
    })
  }
  return true
}

/**
 *
 * @param {object} account
 * @return {Promise<boolean>}
 */
const update = async (account) => { // any reddit account will do.
  const requester = await createRequester(account)
  const subreddits = await requester.getTop({ time: 'day' })
    .map((post) => post.subreddit_name_prefixed)
  return await insertSubreddit(subreddits)
}

module.exports = {
  subredditPopulateJob
}
