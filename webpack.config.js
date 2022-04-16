const path = require('path')

module.exports = (env, _) => {
  const config = {
    mode: env.mode,
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        serveIndex: true,
      },
      hot: false,
      devMiddleware: {
        writeToDisk: true,
      },
      compress: true,
      port: 9000,
    },
    entry: './src/utparser.js',
    output: {
      filename: 'Untracker.min.js',
      path: path.join(__dirname, 'dist'),
    },
    optimization: {
      minimize: true,
    },
  }
  return config
}