/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const PATHS = {
  // eslint-disable-next-line no-undef
  dist: path.join(__dirname, './dist')
};

const isProduction = process.env.NODE_ENV === 'production';

const publicAssetPath = process.env.PUBLIC_ASSET_PATH;
const accessKeyId = process.env.KANTTIINIT_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.KANTTIINIT_AWS_SECRET_ACCESS_KEY;
const s3Bucket = process.env.S3_BUCKET;
const s3Region = process.env.S3_REGION;
const apiBase = process.env.API_BASE || 'https://kitchen.kanttiinit.fi';

const definePlugin = new webpack.DefinePlugin({
  IS_PRODUCTION: isProduction,
  VERSION: JSON.stringify(pkg.version),
  API_BASE: JSON.stringify(apiBase),
  PUBLIC_ASSET_PATH: JSON.stringify(publicAssetPath)
});

const plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!worker*', '!version.txt']
  }),
  definePlugin,
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    chunks: ['app']
  }),
  new HtmlWebpackPlugin({
    template: './admin/index_admin.html',
    filename: 'index_admin.html',
    chunks: ['admin']
  }),
  new CopyPlugin({
    patterns: [{ from: './src/assets', to: '.' }]
  })
];

if (isProduction) {
  plugins.push(
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[file]',
      deleteOriginalAssets: true
    }),
    new S3Plugin({
      include: /.*\.(map|js|png|svg)/,
      s3Options: { accessKeyId, secretAccessKey },
      s3UploadOptions: {
        Bucket: s3Bucket,
        Region: s3Region,
        ContentEncoding(fileName) {
          if (/\.(js|css)$/.test(fileName)) {
            return 'gzip';
          }
        }
      }
    })
  );
}

const commonConfig = {
  optimization: {
    minimizer: isProduction ? [new TerserPlugin()] : []
  },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.scss']
  },
  devtool: isProduction ? false : 'eval'
};

const appConfig = {
  ...commonConfig,
  entry: {
    app: ['./src/index.tsx'],
    admin: ['./admin/index.tsx']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: false
      }
    }
  },
  output: {
    path: PATHS.dist,
    publicPath: isProduction ? publicAssetPath : '/',
    filename: '[name].[fullhash].js',
    chunkFilename: '[fullhash].chunk.[chunkhash].js'
  },
  devServer: {
    static: {
      directory: PATHS.dist,
    },
    historyApiFallback: {
      index: 'index.html'
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|svg)$/,
        type: 'asset/resource',
      },
      { test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ }
    ]
  },
  plugins
};

const workerConfig = {
  ...commonConfig,
  entry: './src/worker',
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: 'worker.js'
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ }]
  },
  plugins: [definePlugin]
};

// eslint-disable-next-line no-undef
module.exports = [appConfig, workerConfig];
