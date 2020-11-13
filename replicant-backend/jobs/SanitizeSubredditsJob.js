const { sequelize } = require('../db')

/**
 * Deletes all saved posts from unapproved subreddits
 * @return {Promise<void>}
 */
module.exports.sanitizeSubreddits = async () => {
  const subredditNames = await sequelize.models.Subreddit.findAll({
    where: {
      isApproved: false
    }
  }
  )
  for (const subredditName of subredditNames) {
    await sequelize.models.Post.destroy({
      where: {
        subreddit: subredditName.dataValues.name
      }
    }
    )
    console.log(subredditName.dataValues.name + ' sanitized')
  }
}
