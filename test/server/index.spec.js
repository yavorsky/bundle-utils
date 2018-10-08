const path = require('path');
const supertest = require('supertest');
const { execSync } = require('child_process');
const { generateExamples, removeExamples } = require('../../utils/scripts/generate-examples');
const { chrome, safari } = require('./ua');

describe('server', () => {
  describe('express', () => {
    let request;

    beforeAll(() => {
      generateExamples('../../server/fixtures/express-server');
      const configPath = path.join(__dirname, 'fixtures/express-server', 'webpack.config.js');
      execSync(`webpack --config=${configPath}`);
      const app = require('./fixtures/express-server/server');
      request = supertest.agent(app);
    });

    afterAll(() => {
      removeExamples('../../server/fixtures/express-server');
    });

    it('express simple', async () => {
      const chromeRes = await request
        .get('/main.js')
        .set('user-agent', chrome)
        .expect(200);

      const safariRes = await request
        .get('/main.js')
        .set('user-agent', safari)
        .expect(200);

      expect(chromeRes.text.length).toBeGreaterThan(0);
      expect(safariRes.text.length).toBeGreaterThan(0);
      expect(safariRes.text.length).toBeGreaterThan(chromeRes.text.length);
      });
  });
});
