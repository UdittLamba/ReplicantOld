const { sequelize, createRequester } = require('../db')

/**
 * fetch and store top posts of approved subs and subscribe
 * to approved subreddits.
 * @param {String} time Eg: 'hour', 'day', 'month', 'year' or 'alltime'
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
const fetchTopPostsJob = async (time) => {
  let account
  try {
    account = await sequelize.models.Account.findOne({
      where: {
        isSold: false,
        isSuspended: false
      }
    })
    await getTopPostsPerSub(account, time)
  } catch (err) {
    console.log(err)
  }
}

/**
 *
 * @param {object} account
 * @param {String} time
 * @return {Promise<(Model<TModelAttributes, TCreationAttributes>|boolean)[]>}
 */
const getTopPostsPerSub = async (account, time) => {
  let posts
  let subs = null
  /*
     any random qualified account will work here.
   */
  const requester = await createRequester(account)
  subs = await sequelize.models.Subreddit.findAll({
    where: {
      isApproved: true
    }
  })
  for (const subName of subs) {
    posts = await requester.getSubreddit(subName.dataValues.name)
      .subscribe()
      .getTop(time)
    await insertPosts(posts)
  }
}

/**
 *
 * @param {object[]} posts
 * @return {Promise<[Model<TModelAttributes, TCreationAttributes>, boolean]>}
 */
const insertPosts = async (posts) => {
  try {
    for (const post of posts) {
      // Avoid OC content where poster makes a self reference.
      // Avoid posts with less than 1000 karma.
      // Avoid reddit hosted video media.
      if (!post.title.includes('I') && !post.title.includes('My ') &&
          !post.title.includes(' my ') &&
          post.domain !== 'v.redd.it' && post.ups > 1000) {
        return await sequelize.models.Post.findOrCreate({
          where: { name: post.name },
          defaults: {
            title: post.title,
            name: post.name,
            upvoteRatio: post.upvote_ratio,
            ups: post.ups,
            downs: post.downs,
            score: post.score,
            subreddit: post.subreddit.display_name,
            isOriginalContent: post.is_original_content,
            isRedditMediaDomain: post.is_reddit_media_domain,
            isMeta: post.is_meta,
            edited: post.edited,
            isSelf: post.is_self,
            selfText: post.selftext,
            selfTextHtml: post.selftext_html,
            created: post.created,
            over18: post.over_18,
            url: post.url,
            domain: post.domain
          }
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  fetchTopPostsJob
}
