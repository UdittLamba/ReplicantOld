const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    ,{
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

class Account extends Model{}

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
        unique: true
    },
    clientId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientSecret: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postKarma: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commentKarma: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cakeDay: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Account'
});