const port = process.env.port
module.exports = {
  outputDir: 'dist',
  // publicPath不能设置为 './', 会导致Vue router history Uncaught SyntaxError: Unexpected token '<'
  // https://www.jianshu.com/p/eaca104a9e07
  publicPath: '/',
  devServer: {
    port: port,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://127.0.0.1:8000',
        ws: false,
        changeOrigin: true
      }
    }
  }
}
