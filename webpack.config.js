const path = require('path');
const webpack = require('webpack');

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
  	  { test: /\.ts$/, loader: 'ts-loader' }
  	]
  },  
  target: 'node',
  plugins: [
  	new webpack.optimize.UglifyJsPlugin()
  ]
};