const {describe, it} = require('@jest/globals');


const {accountUpdateHandler,
  subredditPopulateHandler,
  topPostFetchHandler,
  postScheduleHandler,
  karmaFarmingHandler} = require('../handler');


describe('checkAccountUpdate', () => {
  it('should call accountUpdateHandler and return', async () => {
    expect(await accountUpdateHandler())
        .resolves;
  });
});
// describe('checkSubredditPopulate', () => {
//   it('should call subredditPopulateHandler and return', async () => {
//     expect(await subredditPopulateHandler())
//         .resolves;
//   });
// });
describe('checkTopPostFetch', () => {
  it('should call topPostFetchHandler and return', () => {
    expect(topPostFetchHandler())
        .resolves;
  });
});
// describe('checkPostSchedule', () => {
//   it('should call postScheduleHandler and return', async () => {
//     expect(await postScheduleHandler())
//         .resolves;
//   });
// });
// describe('checkKarmaFarming', () => {
//   it('should call karmaFarmingHandler and return', async () => {
//     expect( await karmaFarmingHandler())
//         .resolves;
//   });
// });
