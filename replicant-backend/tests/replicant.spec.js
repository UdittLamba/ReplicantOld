const {describe, it} = require('jest');

const {accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler} = require('../handler');


describe('checkAccountUpdate', () => {
  it('should call accountUpdateHandler and return', () => {
    expect(accountUpdateHandler())
        .resolves;
  });
});
describe('checkSubredditPopulate', () => {
  it('should call accountUpdateHandler and return', () => {
    expect(subredditPopulateHandler())
        .resolves;
  });
});
describe('checkTopPostFetch', () => {
  it('should call accountUpdateHandler and return', () => {
    expect(topPostFetchHandler())
        .resolves;
  });
});
describe('checkPostSchedule', () => {
  it('should call accountUpdateHandler and return', () => {
    expect(postScheduleHandler())
        .resolves;
  });
});
describe('checkKarmaFarming', () => {
  it('should call accountUpdateHandler and return', () => {
    expect(karmaFarmingHandler())
        .resolves;
  });
});
