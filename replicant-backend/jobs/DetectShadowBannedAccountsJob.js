const axios = require('axios')
const { sequelize } = require('../db')
const { report } = require('../comms/telegram/replicantMessenger')

/**
 * Detects shadowbanned accounts by pinging /user/<USERNAME>,
 * account is assumed to be shadowbanned if the response returns a 404 status.
 * @return {Promise<AxiosResponse<any>>}
 */
const detectShadowbannedAcc = async () => {
  const baseRedditUrl = 'https://old.reddit.com/user/'
  const accounts = await sequelize.models.Account.findAll({
    where: {
      isSold: false,
      isSuspended: false,
      isShadowbanned: false
    }
  })
  for (const account of accounts) {
    try {
      return await axios({
        method: 'get',
        url: baseRedditUrl + account.dataValues.username,
        responseType: 'json'
      })
    } catch (err) {
      console.log(err.response.status)
      if (err.response.status) {
        await sequelize.models.Account.update({
          isShadowBanned: true
        }, {
          where: {
            username: account.username
          }
        })
        await report(account.dataValues.username +
          ' has been SHADOWBANNED!!!')
      }
    }
  }
}

module.exports = {
  detectShadowbannedAcc
}
