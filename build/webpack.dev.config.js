'use strict'
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.config');
const portfinder = require('portfinder');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const packageConfig = require('../package');

const devWebpackConfig = merge(baseWebpackConfig, {
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'cheap-module-source-map',
  devtool: 'cheap-source-map',
  devServer: {
    clientLogLevel: 'warning',
    disableHostCheck: true,
    hot: true,
    inline: true,
    // historyApiFallback: {
    //   rewrites: [{
    //     from: /.*/,
    //     to: path.posix.join('/', 'index.html')
    //   }]
    // },
    // 2018-6-14
    contentBase: path.resolve(__dirname, '../build'),
    // contentBase: false,
    compress: true,
    host: '0.0.0.0',
    port: '3333',
    open: false,
    // 此项配置错误是否在浏览器上全屏显示
    overlay: {
      warnings: true,
      errors: true
    },
    publicPath: '/',
    proxy: {
      "/webservice/*": {
        // target: "http://192.168.14.20:9080",
        target: "http://192.168.13.242"                
      },
      "/upload/*": {
        // target: "http://192.168.14.20:9080",     
        target: "http://192.168.13.242"                                  
      },
      "/servlet/*": {
        // target: "http://192.168.14.20:9080",               
        target: "http://192.168.13.242"                        
      }
    }
    // proxy: utils.proxy,
    // quiet: true,
  },
  module: {
    rules: [{
      test: /(\.css|\.sass|\.scss)$/,
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      }, // 查询参数 importLoaders，用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: (loader) => [
            // require('postcss-flexbugs-fixes'),
            // require('postcss-import')({ root: loader.resourcePath }),
            // require('postcss-cssnext')(),
            // require('cssnano')(),
            require('autoprefixer')({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway })
              ],
              flexbox: 'no-2009',
            })
          ]
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 将所有从node_modules中的模块打包到vendor 2018-6-14
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks: Infinity
      minChunks(module) {
        return (
          module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules') === 0)
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      // filename: 'manifest.js',
      minChunks: Infinity
    }),
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../static'),
    //   to: 'static',
    //   ignore: ['.*']
    // }])
  ].concat(utils.htmlPlugin())

});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || '3333';
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      process.env.PORT = port;
      devWebpackConfig.devServer.port = port;
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          message: [`your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: (() => {
          const notifier = require('node-notifier');
          return (severity, errors) => {
            if (severity !== 'error') return;
            const error = errors[0];
            const filename = error.file && error.file.split('!').pop();
            notifier.notify({
              title: packageConfig.name,
              message: severity + ': ' + error.name,
              subtitle: filename || ''
            })
          }
        })()
      }))
      resolve(devWebpackConfig)
    }
  })

});