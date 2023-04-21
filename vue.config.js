module.exports = {
  devServer: {
    proxy: {
      '^/cas': {
        target: 'http://localhost:55555',//接口的前缀
        ws:true,//代理websocked
        changeOrigin:true,//虚拟的站点需要更管origin
        pathRewrite:{
          '^/cas':''//重写路径
        }
      }
    },
  },
  //这个在打包时必须打开
  publicPath:'./',



}