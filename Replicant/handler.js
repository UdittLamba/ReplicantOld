'use strict';
const Account = require('./db');
const moment = require('moment');
//const subredditPopulate = require("./jobs/SubredditPopulateJob");
const fetchTopPosts = require("./jobs/FetchTopPostsJob");

exports.botHandler = () => {
    const acc = new Account();
    if (moment().format("hA") === '12AM') {
        //subredditPopulate();
        fetchTopPosts('today');
    }
    acc.fetchAccountData().catch((err) => console.log(err));

}


//botHandler().then(console.log);
/*module.exports = {
    botHandler
};*/

// module.exports.reportHandler = async => {
//     return{
//         statusCode: 200,
//         body: JSON.stringify(
//             {
//                 message: 'Go Serverless v1.0! Your function executed successfully!',
//                 input: event,
//             },
//             null,
//             2
//         ),
//     }
// }
