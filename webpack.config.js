const path = require('path');

// Plugins
const FsWebpackPlugin = require('fs-webpack-plugin');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  module: {
    rules: [{
      test: /.(ts|tsx)$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'ts-loader'
    }]
  },
  plugins: [
    new FsWebpackPlugin([{
      type: 'delete',
      files: 'build'
    }], { verbose: true })
  ]
};
