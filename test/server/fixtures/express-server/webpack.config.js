'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { mapConfigToTargets, getBundleLocationWithId } = require('../../../../utils/env-bundles');

module.exports = mapConfigToTargets({ root: __dirname }, ({ browsers, id }) => {
  return {
    mode: 'production',
    entry: [path.join(__dirname, 'app/main.js')],
    output: {
      path: getBundleLocationWithId(`${__dirname}/dist/`, id),
      filename: '[name].js',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin(),
    ],
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
                  targets: {
                    browsers,
                  },
                  shippedProposals: true,
                  useBuiltIns: 'usage',
                },
              ],
            ],
          },
        },
        {
          test: /\.html$/,
          loader: 'html',
        },
      ],
    },
  };
});
