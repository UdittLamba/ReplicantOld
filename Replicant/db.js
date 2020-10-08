const {DataTypes, Sequelize} = require('sequelize');
const snoowrap = require('snoowrap');
const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    , {
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql',
        pool: {
            /*
             * Lambda functions process one request at a time but your code may issue multiple queries
             * concurrently. Be wary that `sequelize` has methods that issue 2 queries concurrently
             * (e.g. `Model.findAndCountAll()`). Using a value higher than 1 allows concurrent queries to
             * be executed in parallel rather than serialized. Careful with executing too many queries in
             * parallel per Lambda function execution since that can bring down your database with an
             * excessive number of connections.
             *
             * Ideally you want to choose a `max` number where this holds true:
             * max * EXPECTED_MAX_CONCURRENT_LAMBDA_INVOCATIONS < MAX_ALLOWED_DATABASE_CONNECTIONS * 0.8
             */
            maxConnections : 50,
            /*
             * Set this value to 0 so connection pool eviction logic eventually cleans up all connections
             * in the event of a Lambda function timeout.
             */
            min: 0,
            /*
             * Set this value to 0 so connections are eligible for cleanup immediately after they're
             * returned to the pool.
             */
            idle: 1000,
            // Choose a small enough value that fails fast if a connection takes too long to be established.
            acquire: 30000,
            /*
             * Ensures the connection pool attempts to be cleaned up automatically on the next Lambda
             * function invocation, if the previous invocation timed out.
             */
            evict: 50
        }
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
        unique: true
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
    isSuspended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cakeDay: {
        type: DataTypes.DATE,
    }
})

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
    }
})

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
    }
})

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
        allowNull: false
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
})

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
    }
})

//relationships between tables goes here
// Account.hasMany(PostQueue, {as:'PostQueues'});
// Account.hasMany(SubmittedPost, {as: 'SubmittedPosts'});
// Post.hasOne(SubmittedPost, {as: 'SubmittedPost'});
// Post.hasOne(PostQueue, {as: 'PostQueue'});

/**
 *
 * @param accountName
 * @returns {Promise<Model<TModelAttributes, TCreationAttributes> | null>}
 */
getAccount = async (accountName) => {
    return sequelize.models.Account.findOne({
        where: {
            isSold: false,
            isSuspended: false,
            username: accountName
        },
    });
}

getPost = async (postId) => {
    return sequelize.models.Post.findByPk(postId)
}

insertSubmittedPost = async (job) => {
     return sequelize.models.SubmittedPost.findOrCreate({
         where: {
             postId: job.dataValues.postId,
             postName: job.dataValues.postName,
             submitter: job.dataValues.submitter
         }
     }).catch((err) => {console.log(err)})
}

 setIsDone =  (postId,bool) => {
    sequelize.models.PostQueue.update({
        isDone: bool
    },{
        where: {postId: postId}
        }).catch((err) => {console.log(err)})
 }

/**
 * fetch and store comment and link karma from reddit api.
 * @returns {Promise<void>}
 */
updateAccountKarma = async () => {
    return sequelize.models.Account.findAll({
        where: {
            isSold: false
        }
    }).then((accounts) => {
        for (const account of accounts) {
            const requester = createRequester(account);
            requester.getMe().then((me) => {
                sequelize.models.Account.update({
                    postKarma: me.link_karma,
                    commentKarma: me.comment_karma,
                    isSuspended: me.is_suspended
                }, {
                    where: {
                        username: account.username
                    }
                })
            }).catch((err) => {
                console.log(err)
            });
        }

    }).catch((err) => {
        console.log(err)
    });

}

/**
 * Hides sensitive information like passwords and client secret
 * when exposing db information via '/accounts/all' endpoint.
 * @returns {Promise<unknown>}
 */
fetchAllAccounts = async () => {
    const promise = new Promise((resolve, reject) => {
        sequelize.models.Account.findAll({
                attributes: {
                    exclude: ['clientSecret', 'password', 'updatedAt']
                }
            }
        ).then((accounts) => {
            const accs = [];
            for (const account of accounts) {
                accs.push(account.dataValues);
            }
            resolve(accs)
        }).catch((err) => reject(Error(err)))
    }).catch((err) => {
        console.log(err)
    });
    return promise;
}

/**
 *
 * @returns {Promise<unknown>}
 */
fetchAllSubreddits = async () => {
    const promise = new Promise((resolve, reject) => {
        sequelize.models.Subreddit.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ).then((subreddits) => {
            const subs = [];
            for (const subreddit of subreddits) {
                subs.push(subreddit.dataValues);
            }
            resolve(subs)
        }).catch((err) => reject(Error(err)))
    }).catch((err) => {
        console.log(err)
    });
    return promise;
}

createRequester = async (account) => {
     return new snoowrap({
        userAgent: account.dataValues.userAgent,
        clientId: account.dataValues.clientId,
        clientSecret: account.dataValues.clientSecret,
        username: account.dataValues.username,
        password: account.dataValues.password
    });
}
//sequelize.sync({alter:true}).catch();

// sequelize.models.Account.create({
//     userAgent: 'Replicant Bot 1.0.0',
//     username: 'Letterhead-Mindless',
//     password: 'xp0Y2l@#fLDN',
//     clientId: 'e8OC-bfxUDa9lA',
//     clientSecret: 'dcseJlzRZPART5CPM-UGhCrhw0Y'
// }).catch(console.log);

//acc.getAccount(2).then(console.log)
module.exports = {
    sequelize,
    getAccount,
    updateAccountKarma,
    fetchAllAccounts,
    fetchAllSubreddits,
    createRequester,
    getPost,
    insertSubmittedPost,
    setIsDone
};