const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const pkg = require('./package.json')

const PATHS = {
  app: './src/index.tsx',
  html: './src/index.html',
  dist: path.join(__dirname, './dist')
}

const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.DefinePlugin({
    IS_PRODUCTION: isProduction,
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
    VERSION: JSON.stringify(pkg.version),
    API_BASE: JSON.stringify(process.env.API_BASE || 'https://kitchen.kanttiinit.fi')
  })
]

if (isProduction) {
  plugins.push(new UglifyJSPlugin())
}

module.exports = {
  entry: {
    app: [PATHS.app, PATHS.html],
    admin: ['./admin/index.tsx', './admin/index_admin.html']
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
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
      { test: /\.tsx?$/, use: ['ts-loader'] },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
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
