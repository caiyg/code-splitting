'use strict'
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 提取css插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


const webpackConfig = merge(baseWebpackConfig, {
  //   devtool: "#source-map",
  //   entry: {...utils.entries(),vendor:['react','react-dom']},  
  // entry: utils.entries(),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: path.posix.join('[name].[chunkhash].js'),
    chunkFilename: path.posix.join('[id].[chunkhash].js'),
    publicPath: './'
  },
  // externals:['react','react-dom'],
  module: {
    rules: [{
      test: /(\.css|\.sass|\.scss)$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: (loader) => [
              // require('postcss-import')({ root: loader.resourcePath }),
              // require('postcss-cssnext')(),
              // require('cssnano')(),
              require('autoprefixer')({
                browsers: 'last 5 version'
              })
            ]
          }
        },
        {
          loader: 'sass-loader'
        }
        ]
      })
    }]
  },
  plugins: [
    // new webpack.DefinePlugin ({
    //   'process.env.NODE_ENV': JSON.stringify ('production')
    // }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('[name]-[hash].css'),
    // 将所有从node_modules中的模块打包到vendor
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks: Infinity
      // minChunks: 5,
      minChunks(module) {
        return (
          module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules') === 0)
        )
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   minChunks: 5,
    //   // minChunks(module) {
    //   //   return (
    //   //     module.resource && /\.js$/.test(module.resource) &&
    //   //     module.resource.indexOf(path.join(__dirname, '../node_modules') === 0)
    //   //   )
    //   // }
    // }),
    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       drop_console: true
    //     }
    //   }
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   children: true,
    //   async: true,
    //   minChunks: 2
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      // filename: 'manifest.js',
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap:true,
      output:{
        comments:false
      }
    })
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../static'),
    //   to: 'static',
    //   ignore: ['.*']
    // }])
  ].concat(utils.htmlProductionPlugin())
})

module.exports = webpackConfig;