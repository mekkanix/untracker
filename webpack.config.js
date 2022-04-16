const path = require('path')

module.exports = (env, _) => {
  // CLI args
  const compileMode = env['compile-mode']
  // Internal state
  const minimizeCode = compileMode === 'production'

  const config = {
    mode: 'production',
    entry: './src/utparser.js',
    output: {
      filename: 'Untracker.min.js',
      path: path.join(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      minimize: minimizeCode,
    },
  }
  return config
}