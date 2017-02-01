// UMD config

const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    'js-search': './source/index.js'
  },
  output: {
    path: 'dist/umd',
    filename: 'js-search.js',
    libraryTarget: 'umd',
    library: 'JsSearch'
  },
  externals: {
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      comments: true,
      mangle: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'source')
      }
    ]
  }
}
