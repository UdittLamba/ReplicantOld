const Account = require('../db');

const accountUpdaterJob =  () => {

    Account.findAll().then((users) => {
        console.log(users);
    });
}

module.exports = accountUpdaterJob;