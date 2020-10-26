const {test, describe} = require('@jest/globals');
const {
  accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler,
} = require('../handler');

describe('checkAccountUpdate', () => {
  test('should call accountUpdateHandler and resolve', async () => {
    try {
      await accountUpdateHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  }, 10000);
});
describe('checkSubredditPopulate', () => {
  test('should call subredditPopulateHandler and resolve', async () => {
    try {
      await subredditPopulateHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
describe('checkTopPostFetch', () => {
  test('should call topPostFetchHandler and resolve', async () => {
    try {
      await topPostFetchHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  }, 10000);
});

describe('checkPostSchedule', () => {
  test('should call postScheduleHandler and resolve', async () => {
    try {
      await postScheduleHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});

describe('checkKarmaFarming', () => {
  test('should call karmaFarmingHandler and resolve', async () => {
    try {
      await karmaFarmingHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  }, 6000);
});
