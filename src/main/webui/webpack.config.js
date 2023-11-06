/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'app_bundle.js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {test: /\.js$/u, use: 'babel-loader', exclude: /node_modules/u},
      {test: /\.jsx?$/u, use: 'babel-loader', exclude: /node_modules/u},
      {test: /\.css$/u, use: ['style-loader', 'css-loader']},
      {
        test: /\.(pdf|jpg|png|gif|svg|ico)$/u,
        use: [
          {
            loader: 'url-loader'
          },
        ]
      }
    ]
  }
};
