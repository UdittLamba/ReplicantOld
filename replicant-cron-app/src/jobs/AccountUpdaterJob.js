const { Sequelize, DataTypes, Model } = require('sequelize');
const Account = require('../models/Account');


const accountUpdaterJob =  () => {
    // Account.create({ userAgent: "Replicant bot 1.0.0", clientId: "w9xhr3qt0YVPMQ",
    //     clientSecret: "H5T9FdAA1f5Am_w9wUfA2PR8YwE", username: "tanmay_shrivastav", password: "P9tHymL29ujA6nb" });
    const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
        ,{
            host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
            dialect: 'mysql'
        });
    Account.findAll().then((users) => {
        console.log(users);
    });

}

module.exports = accountUpdaterJob;