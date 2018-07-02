/* This module provides utils to parse useragent, detect best bundle
  for current useragent, creates map between browsers and supported environments.
*/

const browserslist = require('browserslist');
const parseUA = require('ua-parser-js');
const path = require('path');
const fs = require('fs');
const { sync } = require('glob');
const { readTargetsFromConfig } = require('./env-bundles');

const getDefaultRoot = () => process.cwd();
const defaultRoot = getDefaultRoot();

// TODO
// const getBundleLocationWithWebpack = (root = getDefaultRoot(), borwsers) => {
//   const webpackConfigPath = path.join(root, 'webpack.config.js');
// };

const getBundleStatistics = (bundleRoot, browsers) => {
  return browsers.map((query, id) => {
    const bundleFiles = sync(`${bundleRoot}/${id}/**/*.js`);
    // const bundlePath = path.join(root, 'dist', `${id}`, 'main.js');
    return bundleFiles.reduce((total, bundlePath) => {
      total += fs.statSync(bundlePath).size;
      return total;
    }, 0);
  });
};

// Keep it in the separate module to extend in the future.
const parseQuery = query => browserslist(query);
const queryToMap = query => {
  const parsed = parseQuery(query);

  return parsed.reduce((total, target) => {
    const [browser, version] = target.split(' ');
    total[browser] = parseFloat(version);
    return total;
  }, {});
};

const logBestBundle = ({
 browser, version, id, size, query
}) => {
  console.log(`Found best bundle with id: ${id}
query: ${query}
browser: ${browser}
version: ${version}
size: ${size / 1000}kB
`);
};

const initSuccessLog = (config, stats) => {
  console.log(`Serving ${config.length} bundles:\n`);
  console.log(config.map((query, i) => `${query} [${stats[i] / 1000}kB]`).join('\n'));
};

const browsersMap = {
  'mobile android': 'and_chr',
  'opera mini': 'op_mini',
  'mobile safari': 'ios_saf'
};

const getBestBundleDataFromConfig = ({
 config, browser, version, stats
}) => {
  return config.reduce((best, current, id) => {
    const bestSize = best ? best.size : 0;
    const targets = queryToMap(current);
    browser = browsersMap[browser] || browser;
    if (targets[browser] && (targets[browser] <= version || targets[browser] === 'all')) {
      const currBundleSize = stats[id];
      if (!bestSize || currBundleSize < bestSize) {
        return { id: id.toString(), size: currBundleSize, query: current };
      }
    }
    return best;
  }, null);
};

const normalizeUseragent = browser => browser.toLowerCase();
const normalizeVersion = version => parseFloat(version);

const idGetterWithStats = ({ stats, config, withUAParse }) => data => {
  let browser;
  let version;

  if (withUAParse) {
    const parsed = parseUA(data.headers['user-agent']).browser;
    browser = parsed.name;
    version = parsed.version;
  } else {
    console.log(data, 2);
    browser = data.browser;
    version = data.version;
  }

  browser = normalizeUseragent(browser);
  version = normalizeVersion(version);
  const bestBundleData = getBestBundleDataFromConfig({
 config, browser, version, stats
});
  if (bestBundleData) {
    const { id, size, query } = bestBundleData;
    // TODO: Add debug option.
    logBestBundle({
 browser, version, id, size, query
});
    return id;
  }
  return null;
};

const createBundleGetter = ({ stats, config }) => {
  return {
    getBundleIdByUseragent: idGetterWithStats({ stats, config }),
    getBundleIdByRequest: idGetterWithStats({ stats, config, withUAParse: true }),
  };
};

const initializeBundleGetter = opts => {
  const bundlesRoot = opts.bundlesRoot || path.join(defaultRoot, 'dist');
  const config = opts.targets || readTargetsFromConfig(defaultRoot);
  const stats = getBundleStatistics(bundlesRoot, config);
  initSuccessLog(config, stats);
  return createBundleGetter({ stats, config });
};

module.exports = {
  initializeBundleGetter
};
