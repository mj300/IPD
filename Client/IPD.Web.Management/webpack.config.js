﻿const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const outputPath = '/build/development/src';
const devServerPath = '/build/development';
const outputPublicPath = './build/development/public';
const path = require('path');
module.exports = {
   entry: './src/index.tsx',
   resolve: {
      extensions: [".js", ".json", ".ts", ".tsx", ".css"]
   },
   output: {
      publicPath: "/",
      path: path.join(__dirname, outputPath),
      filename: 'IPD-build.js'
   },
   devServer: {
      https: false,
      contentBase: path.join(__dirname, devServerPath),
      port: 44450,
      historyApiFallback: true,
      open: true,
      //host: '192.168.42.3'
   },
   module: {
      rules: [
         {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: "ts-loader"
               }
            ]
         },
         // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
         {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
         },
         {
            test: /\.css$/i,
            use: [
               {
                  loader: "@teamsupercell/typings-for-css-modules-loader",
                  options: {
                     banner:
                        "// autogenerated by typings-for-css-modules-loader. \n// Please do not change this file!"
                  }
               },
               {
                  loader: "style-loader",
               },
               {
                  loader: "css-loader",
               }
            ]
         },
         {
            test: /\.scss$/i,
            use: [
               {
                  loader: "@teamsupercell/typings-for-css-modules-loader",
                  options: {
                     banner:
                        "// autogenerated by typings-for-css-modules-loader. \n// Please do not change this file!"
                  }
               },
               {
                  loader: "style-loader",
               },
               {
                  loader: "css-loader",
               },
               {
                  loader: "sass-loader",
               }
            ]
         }
      ]
   },
   plugins: [
      new HtmlWebPackPlugin({
         template: "./public/index.html",
         filename: "../index.html",
      }),
      new CopyPlugin([
         {
            from: path.resolve(__dirname, 'public/'),
            to: path.resolve(__dirname, `${outputPublicPath}/`)
         }
      ])
   ],
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
   }
};