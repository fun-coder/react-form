const path = require('path');
module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: __dirname,
    filename: 'index.js',
    library: 'reactForm',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    }]
  },
};