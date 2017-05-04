const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const pkg = require('./package.json')

const PATHS = {
  app: './src/index.js',
  html: './src/index.html',
  dist: path.join(__dirname, './dist')
}

const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.DefinePlugin({
    isProduction,
    version: JSON.stringify(pkg.version),
    apiBase: JSON.stringify(process.env.API_BASE || 'https://kitchen.kanttiinit.fi')
  })
]

if (isProduction) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false }
  }))
  plugins.push(new webpack.optimize.DedupePlugin())
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
    rules: [
      {
        test: /\.(html|png|svg)$/,
        use: [{
          loader: 'file-loader',
          query: {
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['react-hot-loader', 'babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => ([autoprefixer({ browsers: ['last 2 versions'] })])
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, './src/styles')]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: plugins
}
