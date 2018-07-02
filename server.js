
const path = require('path');
const express = require('express');
const fs = require('fs');
const { initializeBundleGetter } = require('./utils/get-bundle');

const bundlesRoot = path.join(__dirname, 'dist');
const { getBundleIdByRequest } = initializeBundleGetter({ bundlesRoot });

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

if (isDeveloping) {
  app.get('*', (req, res) => {
    let { url } = req;
    if (!url || url === '/') url = 'index.html';
    if (url === '/favicon.ico') {
      res.end();
      return;
    }
    const bundleId = getBundleIdByRequest(req);
    const fullPath = path.join(__dirname, 'dist', bundleId, url);
    res.write(fs.readFileSync(path.join(fullPath)));
    res.end();
  });
} else {
  app.use(express.static(`${__dirname}/dist`));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', err => {
  if (err) {
    console.log(err);
  }
  console.info(
    '==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.',
    port,
    port
  );
});
