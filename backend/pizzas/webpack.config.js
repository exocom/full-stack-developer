const {join} = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  mode: process.env.SLS_DEBUG ? 'development' : 'production',
  entry: {'src/handler': './src/handler.ts'},
  output: {
    libraryTarget: 'commonjs',
    path: join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  //node: { __dirname: false}, // Uncomment - If you want to access files on lambda via path.
  resolve: {extensions: ['.ts', '.js']},
  module: {
    rules: [{test: /\.ts$/, loader: 'ts-loader'}],
  },
  externals: [nodeExternals({modulesDir: join(__dirname, '../node_modules')})],
  plugins: [],
  devtool: process.env.SLS_DEBUG ? 'source-map' : false
};
