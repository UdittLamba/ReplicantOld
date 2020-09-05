const { Sequelize, DataTypes, Model } = require('sequelize');
const snoo = require('snoowrap');

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    ,{
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

const r = new snoo({
    userAgent:'Replicant Bot 1.0.0',
    clientId: 'QEAp6KfBt8dSMQ',
    clientSecret: 'Kx9eyoMftCl6X2thEFHMmyNilrM',
    username: 'andy_adventurous',
    password: 'p63H&*wFZUkj'
})

const num = r.getSubreddit('memes').community_icon;
console.log(JSON.parse(JSON.stringify(num)));
class Subreddit extends Model{}

Subreddit.init({
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
    accountsActive: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    activeUserCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descriptionHtml: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    communityIcon: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Subreddit'
});
