'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { mapConfigToTargets, getBundleLocationWithId } = require('./utils/env-bundles');

module.exports = mapConfigToTargets(({ browsers, id }) => {
  return {
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
                  exclude: ["babel-plugin-check-constants"],
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
