const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'app.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: 'assets/img', to: 'img'},
      ]
    }),
    new DefinePlugin({
      POSTHOG: JSON.stringify(!!process.env['POSTHOG_KEY']),
      POSTHOG_KEY: JSON.stringify(process.env['POSTHOG_KEY']),
    }),
  ],
  devServer: {
    historyApiFallback: true
  },
  watchOptions: {
    ignored: /node_modules/
  }
};