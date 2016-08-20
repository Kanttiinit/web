const webpack = require('webpack');
const path = require('path');

const PATHS = {
  app: './src/index.js',
  html: './src/index.html',
  dist: path.join(__dirname, './dist')
};

const is_prod = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    javascript: PATHS.app,
    html: PATHS.html
  },
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: PATHS.dist
  },
  module: {
    loaders: [
      {
        test: /\.(html|png|svg)$/,
        loader: "file?name=[name].[ext]"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"]
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  },
  plugins: is_prod ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ] : [],
  sassLoader: {
    includePaths: [path.resolve(__dirname, './src/styles')]
  }
};
