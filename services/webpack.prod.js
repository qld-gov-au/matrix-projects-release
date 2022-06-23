const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  'mode': 'production',
  'module': {
    'rules': [
      {
        'test': /\.scss$/,
        'use': [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
          "import-glob-loader"
        ]
      }
    ]
  },
  'plugins': [
    new MiniCssExtractPlugin({
      'filename': "[name].css",
      'chunkFilename': "[name].css",
    }),
    new CleanWebpackPlugin(['dist'],{})
  ]
});
