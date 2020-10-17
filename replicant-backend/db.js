const {DataTypes, Sequelize} = require('sequelize');
const Snoowrap = require('snoowrap');
const dayjs = require('dayjs');
const {sendKarmaReport, report} = require(
    './comms/telegram/replicantMessenger');

const sequelize = new Sequelize(process.env.SCHEMA, process.env.USERNAME,
    process.env.PASSWORD
    , {
      host: process.env.HOST,
      dialect: 'mysql',
      pool: {
        maxConnections: 50,
        min: 0,
        idle: 10000,
        acquire: 30000,
        evict: 50,
      },
    });

/**
 *  MODEL DEFINITIONS
 *
 */
Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clientSecret: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postKarma: {
    type: DataTypes.INTEGER,
  },
  commentKarma: {
    type: DataTypes.INTEGER,
  },
  accountAge: {
    type: DataTypes.STRING,
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isHarvested: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cakeDay: {
    type: DataTypes.DATE,
  },
});

Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  upvoteRatio: {
    type: DataTypes.DECIMAL,
  },
  ups: {
    type: DataTypes.INTEGER,
  },
  downs: {
    type: DataTypes.INTEGER,
  },
  score: {
    type: DataTypes.INTEGER,
  },
  subreddit: {
    type: DataTypes.STRING,
  },
  isOriginalContent: {
    type: DataTypes.BOOLEAN,
  },
  isRedditMediaDomain: {
    type: DataTypes.BOOLEAN,
  },
  isMeta: {
    type: DataTypes.BOOLEAN,
  },
  edited: {
    type: DataTypes.BOOLEAN,
  },
  isSelf: {
    type: DataTypes.BOOLEAN,
  },
  selfText: {
    type: DataTypes.STRING,
  },
  selfTextHtml: {
    type: DataTypes.STRING,
  },
  created: {
    type: DataTypes.BIGINT,
  },
  over18: {
    type: DataTypes.BOOLEAN,
  },
  url: {
    type: DataTypes.STRING,
  },
  domain: {
    type: DataTypes.STRING,
  },
});

Subreddit = sequelize.define('Subreddit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

PostQueue = sequelize.define('PostQueue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  postName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submitter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toBePostedAt: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

SubmittedPost = sequelize.define('SubmittedPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  postName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  submitter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// relationships between tables goes here
// Account.hasMany(PostQueue, {as:'PostQueues'});
// Account.hasMany(SubmittedPost, {as: 'SubmittedPosts'});
// Post.hasOne(SubmittedPost, {as: 'SubmittedPost'});
// Post.hasOne(PostQueue, {as: 'PostQueue'});

/**
 * Fetches a particular account only if it has not been sold or suspended.
 * @param {String} accountName
 * @return {Promise<Model<TModelAttributes, TCreationAttributes> | null>}
 */
getAccount = async (accountName) => {
  return sequelize.models.Account.findOne({
    where: {
      isSold: false,
      isSuspended: false,
      username: accountName,
    },
  });
};

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @param {String||number} postId
 * @return {Promise<Model<TModelAttributes, TCreationAttributes> | null>}
 */
getPost = async (postId) => {
  return sequelize.models.Post.findByPk(postId);
};

/**
 * Insert into table SubmittedPosts after posting on reddit.
 * @param {object} job
 * @return {Promise<void>}
 */
insertSubmittedPost = async (job) => {
  await sequelize.models.SubmittedPost.findOrCreate({
    where: {
      postId: job.dataValues.postId,
      postName: job.dataValues.postName,
      submitter: job.dataValues.submitter,
    },
  });
};

/**
 * Set the value of isDone column of PostQueues table.
 * @param {String|number}postId
 * @param {boolean} bool
 * @return {Promise<void>}
 */
setIsDone = async (postId, bool) => {
  await sequelize.models.PostQueue.update({
    isDone: bool,
  }, {
    where: {postId},
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * fetch and store comment and link karma from reddit api.
 * @return {Promise<void>}
 */
updateAccountKarma = async () => {
  let accounts = null;
  try {
    accounts = await sequelize.models.Account.findAll({
      where: {
        isSold: false,
        isSuspended: false,
      },
    });
    await getAccountsData(accounts);
  } catch (err) {
    console.log('err');
  }
};

// eslint-disable-next-line valid-jsdoc
/**
 * Updates reddit accounts' post and comment karma.
 * Sends a report of the karma status to user through telegram.
 *
 * @param {array[][]} accounts
 * @return {Promise<void>}
 */
getAccountsData = async (accounts) => {
  let me;
  let updatedUser;
  let requester;
  const accountsKarma = [];
  try {
    for (const account of accounts) {
      requester = await createRequester(account);
      me = await requester.getMe();
      updatedUser = await updateRedditUser(me, account);
      if (me.is_suspended === true) {
        await report(account.dataValues.username + ' has been suspended');
      }
      if (account.dataValues.createdAt <= dayjs().subtract(24, 'day')['$d']) {
        accountsKarma.push(updatedUser);
      }
    }
    await sendKarmaReport(accountsKarma);
  } catch (err) {
    console.log(err);
  }
};

/**
 * returns an array with account name and karma.
 * @param {object} me
 * @param {object} account
 * @return {Promise<{postKarma: number, commentKarma: number, username: *}>}
 */
updateRedditUser = async (me, account) => {
  await sequelize.models.Account.update({
    postKarma: me.link_karma,
    commentKarma: me.comment_karma,
    isSuspended: me.is_suspended,
  }, {
    where: {
      username: account.username,
    },
  });
  account = {
    username: account.username,
    postKarma: me.link_karma,
    commentKarma: me.comment_karma,
    isSuspended: me.is_suspended,
  };
  return account;
};

/**
 * Hides sensitive information like passwords and client secret
 * when exposing db information via '/accounts/all' endpoint.
 * @return {Promise<unknown>}
 */
fetchAllAccounts = async () => {
  const accs = [];
  const accounts = await sequelize.models.Account.findAll({
    attributes: {
      exclude: ['clientSecret', 'password', 'updatedAt'],
    },
  });
  await (() => {
    for (const account of accounts) {
      accs.push(account.dataValues);
    }
  });
};

/**
 * Create a custom array of subreddits that excludes their
 * createAt and updatedAt columns.
 * @return {Promise<void>}
 */
fetchAllSubreddits = async () => {
  let subreddits = null;
  const subs = [];
  subreddits = await sequelize.models.Subreddit.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });
  await (() => {
    for (const subreddit of subreddits) {
      subs.push(subreddit.dataValues);
    }
  });
};

/**
 *
 * @param {object} account
 * @return {Promise<Snoowrap>}
 */
createRequester = async (account) => {
  return new Snoowrap({
    userAgent: account.dataValues.userAgent,
    clientId: account.dataValues.clientId,
    clientSecret: account.dataValues.clientSecret,
    username: account.dataValues.username,
    password: account.dataValues.password,
  });
};
// sequelize.sync({alter:true}).catch();

module.exports = {
  sequelize,
  createRequester,
  updateAccountKarma,
  fetchAllSubreddits,
  setIsDone,
  getAccount,
  fetchAllAccounts,
  insertSubmittedPost,
  getPost,
};
