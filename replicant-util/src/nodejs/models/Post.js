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

// const submission = r.getSubreddit('askreddit').getRandomSubmission().then(console.log);

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
        allowNull: false,
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    upvoteRatio: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    ups: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    downs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isOriginalContent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isRedditMediaDomain: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isMeta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    edited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    isSelf: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    selfText: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selfTextHtml:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    created: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    over18: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    }


}, {
    sequelize,
    modelName: 'Post'
});

Post.sync().then(console.log);