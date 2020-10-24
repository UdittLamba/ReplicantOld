import {test} from '@jest/globals';

const {describe, it} = require('@jest/globals');

const {
  accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler,
} = require('../handler');

// describe('checkAccountUpdate', () => {
//   it('should call accountUpdateHandler and resolve', async () => {
//     expect(await accountUpdateHandler())
//         .resolves;
//   }, 3000);
// });
describe('checkSubredditPopulate', () => {
  it('should call subredditPopulateHandler and resolve', async () => {
    try {
      await subredditPopulateHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});
describe('checkTopPostFetch', () => {
  test('should call topPostFetchHandler and resolve', async () => {
    expect.assertions(1);
    try {
      await topPostFetchHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});

describe('checkPostSchedule', () => {
  test('should call postScheduleHandler and resolve', async () => {
    expect.assertions(1);
    try {
      await postScheduleHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }
  });
});

describe('checkSubredditPopulate', () => {
  test('should call karmaFarmingHandler and resolve', async () => {
    expect.assertions(1);
    try {
      await subredditPopulateHandler();
    } catch (e) {
      expect(e).toMatch('error');
    }

  });
});
