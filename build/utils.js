'use strict'
const path = require ('path');
const App = require('../App');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
exports.entries = function () {
  let result = {};
  App.pages.forEach (p => {
    result[ p.entry ] = ['babel-polyfill',path.resolve (App.basePath, p.entry) + '/index.js'];
  });
  // 分块
  result.common = ['react','react-dom'];
  return result;
};
exports.assetsPath = function (_path) {
  // const  assetsSubDirectory = process.env.NODE_ENV === 'production'
  //   ? 'static' : 'static'
  return path.posix.join('static', _path)
}
// dev环境
exports.htmlPlugin = function () {
  let arr = [];
  App.pages.forEach(p=>{
    let conf = {
      template: path.resolve(App.templatePath, p.tpl),
      filename: p.entry + '.html',
      // 2018-6-14
      // chunks: [p.entry],
      chunks: ['manifest', 'vendor','common', p.entry],
      title: p.title,      
      inject: true
    }
    // console.log(process.env.NODE_ENV,'**********$$$$$$$$')
    // console.log(PRODUCTION,99999999)
    // if (process.env.NODE_ENV == 'production') {
    //   conf = merge(conf, {
    //     chunks: ['manifest', 'vendor', p.entry],
    //     minify: {
    //       removeComments: true,
    //       collapseWhitespace: true,
    //       removeAttributeQuotes: true
    //     }
    //   })
    // }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};
// 生产环境
exports.htmlProductionPlugin = function () {
  let arr = [];
  App.pages.forEach(p => {
    let conf = {
      template: path.resolve(App.templatePath, p.tpl),
      filename: p.entry + '.html',
      chunks: [p.entry],
      title: p.title,
      inject: true
    }
    // console.log(process.env.NODE_ENV, '**********$$$$$$$$')
    // console.log(PRODUCTION,99999999)
    // if (process.env.NODE_ENV == 'production') {
    conf = merge(conf, {
      chunks: ['manifest', 'vendor','common', p.entry],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
    // }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};