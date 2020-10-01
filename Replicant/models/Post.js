const { Sequelize, DataTypes, Model } = require('sequelize');
const snoo = require('snoowrap');

const sequelize = new Sequelize('replicant_schema', 'admin', 'anfield1892'
    ,{
        host: 'replicant.cn9bhff6gydg.us-east-1.rds.amazonaws.com',
        dialect: 'mysql'
    });

class Post extends Model{}

Post.init({
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
        type:DataTypes.STRING,
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
    selfTextHtml:{
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


}, {
    sequelize,
    modelName: 'Post'
});

module.exports = Post;