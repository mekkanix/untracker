const path = require('path')
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env, _) => {
  // CLI args
  const compileMode = env['compile-mode']
  // Internal state
  const minimizeCode = compileMode === 'production'
  // const bundleName = !minimizeCode ? 'Untracker.js' : 'Untracker.min.js'

  const config = {
    mode: 'production',
    entry: {
      // Popup
      // 'popup.html': './src/popup/popup.html',
      'Popup': './src/popup/popup.js',
      'Popup.css': './src/popup/popup.sass',
      // Content scripts
      'Untracker': './src/content/utmain.js',
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      iife: false,
      clean: true,
    },
    module: {
      rules: [
        // {
        //   test: /\.(html)$/,
        //    use: ['html-loader'],
        // },
        // SASS
        {
          test: /\.sass$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        // MEDIA
        // {
        //   test: /\.(png|jpg|svg|gif|ico|svg)$/,
        //   loader: 'file-loader',
        //   options: {
        //     publicPath: path.resolve(__dirname, '/dist/'),
        //     outputPath: './',
        //     name: '[name].[ext]',
        //   },
        // },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          './src/popup/popup.html',
        ],
      }),
      new RemoveEmptyScriptsPlugin(),
      // new HtmlWebpackPlugin({
      //   filename: 'popup.html',
      //   template: './src/popup/popup.html',
      //   minify: minimizeCode,
      // }),
      // new IgnoreEmitPlugin(/(?<=main_css\s*).*?(?=\s*js)/gs),
      new MiniCssExtractPlugin({
        filename: '[name]',
      }),
    ],
    optimization: {
      minimize: minimizeCode,
    },
  }
  return config
}
