/* Place for mapping webpack (or something else in the future) with targets.
Webpack will create multiple bundles in case of Array instead of function for config.
So, we just creating array of functions with 2 arguments: browsers and id.
`id` is used for output field to create bundle location for appropriate bundle.
`browsers` we're injecting to the targets for preset-env.
Webpack just creates the list optimized bundles with id, which we can use for our static server
to acces needed files.
*/

const fs = require('fs');
const pify = require('pify');
const path = require('path');

const BROWSERS_CONFIG_NAME = '.browsers.json';
const defaultOptions = {
  root: process.cwd(),
};

const readFileAsync = pify(fs.readFile);

const readTargetsFromConfig = async root => {
  if (!root) root = process.cwd();
  const pathname = path.join(root, BROWSERS_CONFIG_NAME);
  const config = await readFileAsync(pathname);
  const targets = JSON.parse(config);

  return targets;
};

const mapConfigToTargets = (opts, fn) => {
  const optsIsHandler = typeof opts === 'function';
  const handler = optsIsHandler ? opts : fn;
  const optsIsDefault = optsIsHandler || opts == null;
  const options = optsIsDefault ? defaultOptions : opts;

  const parsedTargets = options.targets || readTargetsFromConfig(options.root);
  return parsedTargets.map((browsers, id) => {
    return handler({ browsers, id: id.toString() });
  });
};

// TODO: Optimize this. Make more flexible for different cases.
const getBundleLocationWithId = (location, id) => path.join(location, id);

module.exports = {
  mapConfigToTargets,
  readTargetsFromConfig,
  getBundleLocationWithId,
};
