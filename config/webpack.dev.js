/*
 * Local packages
 */
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
/*
 * External packages
 */
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map-inline',

  debug: true,

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:3000/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    contentBase: "./src/app",
    inline: true,    
    stats: 'minimal',
    port: 3000
    //historyApiFallback: true,
  }
});
