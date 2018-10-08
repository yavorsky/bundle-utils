const md5 = require('md5');

const cache = {};

// eslint-disable-next-line no-return-assign
module.exports = query => cache[query] || (cache[query] = md5(query));
