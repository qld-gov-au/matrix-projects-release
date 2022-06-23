const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  'mode': 'development',
  'devServer': {
    before(app, server) {
      devServer = server;
    },
    'contentBase': './dist',
    'hot': true,
    'host': '0.0.0.0',
    'port': 8080
  },
  'module': {
    'rules': [
      {
        'test': /\.scss$/,
        'use': [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
          "import-glob-loader"
        ]
      }
    ]
  },
  'plugins': [
    new webpack.HotModuleReplacementPlugin()
  ]
});

console.log(module.exports);