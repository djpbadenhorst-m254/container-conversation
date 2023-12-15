const { intro } = require('./intro.js');
const { logbookLoanChannel } = require('./logbookLoanChannel.js');
const { checkoffLoanChannel } = require('./checkoffLoanChannel.js');
const { smeLoanChannel } = require('./smeLoanChannel.js');
const { channelTransition } = require('./channelTransition.js');

module.exports={
  finqual: [
    ...intro,
    ...logbookLoanChannel,
    ...checkoffLoanChannel,
    ...smeLoanChannel,
    ...channelTransition,
  ]
};
