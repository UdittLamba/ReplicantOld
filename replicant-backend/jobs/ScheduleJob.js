const {sequelize} = require('../db');
const dayjs = require('dayjs');
const {Op, Sequelize} = require('sequelize');

const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const pickRandomHour = () => {
  return randomNumber(7, 23);
};

/**
 * Takes random number of accounts and generate random scheduled posts
 * for each account as per the input to the function.
 *
 * Accounts MUST be incubated for 1 week min although ideally
 * it should be incubated for a month.
 * Selected posts MUST be at least a month old.
 *
 * @param {number} numOfAccounts
 * @param {number} numOfPosts
 */
schedulePostJobs = async (numOfAccounts, numOfPosts) => {
  const selectedAccounts = await sequelize.models.Account.findAll({
    order: Sequelize.literal('rand()'),
    where: {
      isSold: false,
      isSuspended: false,
      isHarvested: false,
      postKarma: {
        [Op.lte]: 20000,
      },
      createdAt: {
        [Op.lte]: dayjs().subtract(20, 'day')['$d'],
      },
    },
    limit: numOfAccounts,
  });
  await assignPost(selectedAccounts, numOfPosts);
};

/**
 * Assign <numberOfPosts> posts to selected submitters.
 *
 * @param {Model<TModelAttributes, TCreationAttributes>[]} submitters
 * @param {number} numOfPosts
 * @return {Promise<void>}
 */
assignPost = async (submitters, numOfPosts) => {
  let posts = null;
  for (const submitter of submitters) {
    posts = await sequelize.models.Post.findAll(
        {
          order: Sequelize.literal('rand()'),
          where: {
            createdAt: {
              [Op.lte]: dayjs().subtract(30, 'day')['$d'],
            },
          },
          limit: numOfPosts,
        },
    );
    await schedulePosts(posts, submitter);
  }
};

/**
 * Insert into table PostQueues.
 * @param {object[]} posts
 * @param {Model<TModelAttributes, TCreationAttributes>} submitter
 * @return {Promise<void>}
 */
schedulePosts = async (posts, submitter) => {
  for (const post of posts) {
    await sequelize.models.PostQueue.findOrCreate({
      where: {
        postId: post.dataValues.id,
        postName: post.dataValues.name,
        submitter: submitter.dataValues.username,
        toBePostedAt: pickRandomHour(),
      },
    });
  }
};

module.exports = schedulePostJobs;

