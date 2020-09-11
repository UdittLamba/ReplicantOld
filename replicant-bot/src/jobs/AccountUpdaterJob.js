const { Sequelize, DataTypes, Model } = require('sequelize');
const Account = require('../models/Account');


const accountUpdaterJob =  () => {

    // const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    //     ,{
    //         host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
    //         dialect: 'mysql'
    //     });
    Account.findAll().then((users) => {
        console.log(users);
    });

}

module.exports = accountUpdaterJob;