const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const utils = require('./utils');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}


// var __DEV__ = process.env.NODE_ENV !== 'production';
module.exports = {
  // context: path.join(__dirname,'../'),
  entry: utils.entries(),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "[name].js",
    publicPath: "/"
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: resolve('src'),
      // exclude: [/node_modules/,resolve('src/utils/md5.js'),resolve('src/utils/jquery.qrcode.min.js')],
      exclude: [/node_modules/,resolve('src/utils')],
      options: {
        fix: false,
        emitWarning: true
      }
    },
    {
      test: /\.js[x]?$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      // query: {
      //   // presets: ['env', 'react'],
      //   presets: ['es2015', 'react'],
      //   plugins: ['transform-runtime']
      // }
    },
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      include: [resolve('src/icons')],
      options: {
        symbolId: 'icon-[name]'
      }
    },
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: [
        // 'file-loader'
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }

    ]
  }
};