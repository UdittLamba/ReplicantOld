'use strict';

module.exports.botHandler = async event => {
      const acc = new Account();
      if (moment().format("hA") === '12AM') {
        subredditPopulateJob();
        fetchTopPosts('today');
    }
    acc.fetchAccountData().catch((err) => console.log(err));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.reportHandler = async => {
    return{
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    }
}
