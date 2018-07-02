const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const { execSync } = require('child_process');
const { generateExamples, removeExamples } = require('../../utils/scripts/generate-examples');
const { readTargetsFromConfig } = require('../../utils/env-bundles');

describe('webpack', () => {
  describe('`single-bundle` with > 1% usage', () => {
    let appLocation;
    beforeAll(() => {
      generateExamples('single-bundle');
      appLocation = path.join(__dirname, 'fixtures/single-bundle');
      const configPath = path.join(appLocation, 'webpack.config.js');
      const entry = path.join(appLocation, 'app/main.js');
      execSync(`webpack --config=${configPath}`);
    });

    afterAll(() => {
      removeExamples('single-bundle');
    });

    it('should build single bundle without errors', () => {
      const targets = readTargetsFromConfig(appLocation);
      const firstOutput = path.join(appLocation, 'dist', md5(targets[0]));
      expect(fs.existsSync(firstOutput)).toBeTruthy();
    });

    it('should not build second bundle', () => {
      const secondOutput = path.join(appLocation, 'dist', '19358eafd6d79956a92071d70ca96bae');
      expect(fs.existsSync(secondOutput)).toBeFalsy();
    });
  });
});
