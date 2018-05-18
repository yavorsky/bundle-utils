const { initializeBundleGetter } = require('./utils/get-bundle');
const {
  mapConfigToTargets,
  readTargetsFromConfig,
  getBundleLocationWithId
} = require('./utils/env-bundles');

module.exports = {
  initializeBundleGetter,
  mapConfigToTargets,
  readTargetsFromConfig,
  getBundleLocationWithId,
};
