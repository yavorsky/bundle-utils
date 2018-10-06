# Bundle-utils

![How it works](https://user-images.githubusercontent.com/1521229/34436061-ef845750-ec9a-11e7-9b66-d5e8d00d3d27.png)

### .browsers.json
This is an optional config to configure multiple bundles concept. Just pass all requirements using browserslist notation in array. For each item new bundle will be generated with specific id. Then you can serve it with any static server.

*.browsers.json*
```json
[
  "not dead",
  "last 5 chrome versions, last 5 safari versions, last 5 firefox versions",
  "last 1 chrome version, last 1 safari version, last 1 firefox version",
]
```


### Bundler side
Currently it supports webpack and parcel.

#### Webpack
Since webpack supports multiple configs with array type and creates new bundle for each one, we can just wrap our usual webpack config with `mapConfigToTargets` wrapper and pass here function which expects your webpack config to be returned, but also passes `browsers` and `id` arguments.
This 2 arguments implements the core idea of this package.

Wrap your config with `mapConfigToTargets` and pass `browsers` to babel-preset-env's `targets`. With id you can configure your bundle location. It will be synced with server-side part, so you can easily get it and serve in future.

With the help of `getBundleLocationWithId` we can better resolve bundle location for both server and bundler side.

*webpack.config.js*
```js
const path = require('path');
const { mapConfigToTargets, getBundleLocationWithId } = require('./utils/env-bundles');

module.exports = mapConfigToTargets(({ browsers, id }) => {
  return {
    entry: [path.join(__dirname, 'app/main.js')],
    output: {
      path: getBundleLocationWithId(`${__dirname}/dist/`, id), // generate your output location with specific bundle id.
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: browsers, // pass browsers as a targets for current bundle.
                },
              ],
            ],
          },
        }
      ],
    },
  };
});
```

#### Node.js
Here we just need to read configs and understand the sizes of bundles. So we could serve smallest bundle possble for every target. For example, chrome will receive the smallest bundle, but IE - possibly the biggest.

*server.js*
```js
const BUNDLE_DIRNAME = 'dist';
const bundlesRoot = path.join(__dirname, BUNDLE_DIRNAME);
const { getBundleIdByRequest } = initializeBundleGetter({ bundlesRoot });

app.use(express.static(`${__dirname}/dist`));
app.get('*', (req, res) => {
  const bundleId = getBundleIdByRequest(req);
  const fullPath = path.join(__dirname, BUNDLE_DIRNAME, bundleId, req.url);
  res.write(fs.readFileSync(path.join(fullPath)));
  res.end();
});
```



### License
MIT License

Copyright (c) 2017-2018 all contributors.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
