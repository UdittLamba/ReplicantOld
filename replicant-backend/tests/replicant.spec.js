const {it} = require('./jest');

const {
  accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler,
} = require('../handler');

it('should call accountUpdateHandler and return', () => {
  expect(accountUpdateHandler()).resolves;
});

it('should call accountUpdateHandler and return', () => {
  expect(subredditPopulateHandler()).resolves;
});

it('should call accountUpdateHandler and return', () => {
  expect(topPostFetchHandler()).resolves;
});

it('should call accountUpdateHandler and return', () => {
  expect(postScheduleHandler()).resolves;
});

it('should call accountUpdateHandler and return', () => {
  expect(karmaFarmingHandler()).resolves;
});

