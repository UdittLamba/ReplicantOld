const {describe, it} = require('@jest/globals');

const {accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler} = require('../handler');


describe('checkAccountUpdate', () => {
  it('should call accountUpdateHandler and resolve', async () => {
    expect(await accountUpdateHandler())
        .resolves;
  }, 3000);
});
describe('checkSubredditPopulate', () => {
  it('should call subredditPopulateHandler and resolve', async () => {
    console.log(process.env.HOST);
    expect(await subredditPopulateHandler())
        .resolves;
  });
});
describe('checkTopPostFetch', () => {
  it('should call topPostFetchHandler and resolve', async () => {
    expect(await topPostFetchHandler())
        .resolves;
  });
});
describe('checkPostSchedule', () => {
  it('should call postScheduleHandler and resolve', async () => {
    expect(await postScheduleHandler())
        .resolves;
  });
});
describe('checkKarmaFarming', () => {
  it('should call karmaFarmingHandler and resolve', async () => {
    expect( await karmaFarmingHandler())
        .resolves;
  });
});
