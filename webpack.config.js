const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './server/server.ts',
  output: {
    path: path.resolve(__dirname, '../angular-universal-pwa-starter-deploy'),
    filename: 'server.js'
  },
  resolve: {
  	extensions: ['.ts', '.js']
  },
  module: {
  	loaders: [
  	  { test: /\.ts$/, loader: 'awesome-typescript-loader' }
  	]
  },  
  target: 'node',
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'server'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'server'),
      {}
    ), 
    new webpack.ContextReplacementPlugin(
      /(.+)?typeorm(\\|\/)(.+)?/,
    ),
    new UglifyJSPlugin({
      uglifyOptions: {
        ecma: 8,
        mangle: false
      },
      parallel: 16
    })
  ]
};
