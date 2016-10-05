const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

const PATHS = {
  app: './src/index.js',
  html: './src/index.html',
  dist: path.join(__dirname, './dist')
};

const isProd = process.env.NODE_ENV === 'production';

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }),
  new webpack.optimize.DedupePlugin()
];

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    },
    version: JSON.stringify(pkg.version),
    apiBase: JSON.stringify(process.env.API_BASE || 'https://kitchen.kanttiinit.fi')
  })
];

if (isProd) {
  plugins = plugins.concat(prodPlugins);
}

module.exports = {
  entry: {
    app: [PATHS.app, PATHS.html],
    admin: ['./admin/index.js', './admin/index_admin.html']
  },
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: PATHS.dist,
    historyApiFallback: {
      index: 'index.html'
    }
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
        loader: "style-loader!css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]!postcss-loader!sass-loader"
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  plugins: plugins,
  sassLoader: {
    includePaths: [path.resolve(__dirname, './src/styles')]
  }
};
