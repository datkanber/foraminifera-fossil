const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

if (process.argv.includes("production")) {
  process.env.NODE_ENV = "production";
}

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "assets/js/[name].[contenthash:8].js",
    chunkFilename: "assets/js/[name].[contenthash:8].chunk.js",
    publicPath: "/",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
      },

      {
        test: /\.(glb|gltf|bin)$/i,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".js"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./src/assets/images/logo.png",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/_redirects", to: "_redirects", toType: "file" },
        { from: "public/_headers", to: "_headers", toType: "file" },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://foraminifera-fossil.onrender.com')
    })
  ],

  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: [{ context: ['/api/expert-validation'], target: 'http://127.0.0.1:5000' }],
  },

  devtool: process.env.NODE_ENV === "production" ? false : "source-map",
};
