const { Sequelize, DataTypes, Model } = require('sequelize');
const accountUpdaterJob = require('../jobs/AccountUpdaterJob');


const handler = async () => {
  const accountUpdatorJob = accountUpdaterJob();

};
handler().then(console.log);

module.exports = {
  handler,
};
