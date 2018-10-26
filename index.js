const { initializeBundleGetter } = require('./utils/get-bundle');
const getId = require('./utils/get-id');
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
  getId,
};
