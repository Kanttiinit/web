const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pkg = require("./package.json");

const PATHS = {
  dist: path.join(__dirname, "./dist")
};

const isProduction = process.env.NODE_ENV === "production";

const plugins = [
  new CleanWebpackPlugin("dist"),
  new webpack.DefinePlugin({
    IS_PRODUCTION: isProduction,
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      BUGSNAG_API_KEY: JSON.stringify(process.env.BUGSNAG_API_KEY)
    },
    VERSION: JSON.stringify(pkg.version),
    API_BASE: JSON.stringify(
      process.env.API_BASE || "https://kitchen.kanttiinit.fi"
    )
  })
];

if (isProduction) {
  plugins.push(
    new UglifyJSPlugin({
      sourceMap: true
    })
  );
}

module.exports = {
  entry: {
    app: ["./src/index.tsx", "./src/index.html"],
    worker: ["./src/worker"],
    admin: ["./admin/index.tsx", "./admin/index_admin.html"]
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
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].chunk.js"
  },
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: PATHS.dist,
    historyApiFallback: {
      index: "index.html"
    }
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".scss"]
  },
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.(html|png|svg)$/,
        use: [
          {
            loader: "file-loader",
            query: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ }
    ]
  },
  plugins: plugins
};
