const path = require('path')

module.exports = (env, _) => {
  // CLI args
  const compileMode = env['compile-mode']
  // Internal state
  const minimizeCode = compileMode === 'production'
  // const bundleName = !minimizeCode ? 'Untracker.js' : 'Untracker.min.js'

  const config = {
    mode: 'production',
    entry: {
      Untracker: './src/utparser.js',
      popup: './src/popup/popup.js',
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      iife: false,
      clean: true,
    },
    optimization: {
      minimize: minimizeCode,
    },
  }
  return config
}