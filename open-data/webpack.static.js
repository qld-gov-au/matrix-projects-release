const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  'mode': 'production',
  'output': {
    'path': path.resolve(__dirname, 'static'), // Output folder
    'filename': 'js/[name].js' // JS output path
  },
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
      'chunkFilename': "[id].css",
    }),
    new CleanWebpackPlugin()
  ]
});

const glob = require('glob');
let js_files = glob.sync('./src/modules/**/global.js') // Module JS
module.exports.entry = {
  'main': ['./src/index.js'].concat(js_files)
};
