const {Sequelize, DataTypes, Model} = require('sequelize');
const snoo = require('snoowrap');
require('dotenv').config();

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    , {
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

class Account extends Model {
    /**
     * Select accounts that are not sold.
     * @param numberOfAccounts
     * @returns {Promise<Account[] | void>}
     */
    pickAccounts = (numberOfAccounts) => {
        return Account.findAll({
            where: {
                isSold: false,
                isSuspended: false
            },
            order: sequelize.random(),
            limit: numberOfAccounts
        }).catch((err) => {
            console.log(err)
        });
    }
    /**
     * fetch and store comment and link karma from reddit api.
     * @returns {Promise<void>}
     */
    fetchAccountData = async () => {
        return Account.findAll({
            where: {
                isSold: false
            }
        }).then((accounts) => {
            for (const account of accounts) {
                const requester = new snoo({
                    userAgent: account.userAgent,
                    clientId: account.clientId,
                    clientSecret: account.clientSecret,
                    username: account.username,
                    password: account.password
                })

                requester.getMe().then((me) => {
                    Account.update({
                        postKarma: me.link_karma,
                        commentKarma: me.comment_karma
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
}

Account.init({
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
}, {
    sequelize,
    modelName: 'Account'
});

//clearAccount.sync({alter:true}).catch();

// Account.create({
//     userAgent: 'Replicant Bot 1.0.0',
//     username: 'tasty_amrood',
//     password: 'aF32GKs#C#@K',
//     clientId: 'j_S3fTmLI0O3rw',
//     clientSecret: 'ccZTneok11IMR3XVWZPXZItWISg'
// }).catch(console.log);
//console.log("value",process.env.MYSQL_SCHEMA);
//const acc = new Account();
//acc.pickAccounts(2).then(console.log);
module.exports = Account;