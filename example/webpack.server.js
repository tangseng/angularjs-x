const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path')

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: resolve(__dirname, './main.js'),
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, './'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              modules: false
            }]
          ]
        }
      },
      {
        test: /\.html$/,
        include: resolve(__dirname, './'),
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'angularjs-x': resolve(__dirname, '../index.js')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './index.html'),
      filename: join(__dirname, 'dist', 'index.html'),
      inject: 'body'
    })
  ],
  devServer: {
    contentBase: join(__dirname, 'dist'),
    port: 8888
  }
}

module.exports = config