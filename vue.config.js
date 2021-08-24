module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '《原神》 - 前往未知的冒險旅程'
        return args
      })
  }
}