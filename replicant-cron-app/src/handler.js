const { Sequelize, DataTypes, Model } = require('sequelize');



const handler = async () => {
    const sequelize = new Sequelize('replicant', 'admin', 'anfield1892'
        ,{
            host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
            dialect: 'mysql'
        });

    try {
        sequelize.authenticate();
        return "we did it";
    } catch (error) {
        return ":(";
    }
};

module.exports = {
  handler,
};
