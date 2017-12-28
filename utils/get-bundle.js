/* This module provides utils to parse useragent, detect best bundle
  for current useragent, creates map between browsers and supported environments.
*/

const browserslist = require('browserslist');
const path = require('path');
const fs = require('fs');
const { readTargetsFromConfig } = require('./env-bundles');

const getDefaultRoot = () => process.cwd();
const defaultRoot = getDefaultRoot();

// TODO
// const getBundleLocationWithWebpack = (root = getDefaultRoot(), borwsers) => {
//   const webpackConfigPath = path.join(root, 'webpack.config.js');
// };

const getBundleStatistics = (root = defaultRoot, browsers) => {
  return browsers.map((query, id) => {
    const bundlesPath = path.join(root, 'dist', `${id}`, 'main.js');
    return fs.statSync(bundlesPath).size;
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

const logBestBundle = ({ browser, version, id, size, query }) => {
  console.log(`Found best bundle with id: ${id}
query: ${query}
browser: ${browser}
version: ${version}
size: ${size / 1000}KB
`);
};

const getBestBundleDataFromConfig = ({ config, browser, version, stats }) => {
  return config.reduce((best, current, id)  => {
    const bestSize = best ? best.size : 0;
    const targets = queryToMap(current);
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

const config = readTargetsFromConfig(defaultRoot);
const stats = getBundleStatistics(defaultRoot, config);

const getBundleIdByUseragent = useragent => {
  const browser = normalizeUseragent(useragent.browser);
  const version = normalizeVersion(useragent.version);

  const bestBundleData = getBestBundleDataFromConfig({ config, browser, version, stats });
  if (bestBundleData) {
    const { id, size, query } = bestBundleData;
    // TODO: Add debug option.
    logBestBundle({ browser, version, id, size, query });
    return id;
  }
  return null;
};

module.exports = {
  getBundleIdByUseragent
};
