module.exports = {
  devServer: {
    // index: 'https://localhost:8081/#/',
    https: true,
    // host: '192.168.0.116',
    // port: 8080,
    proxy: {
      '/room': {//代理api
        // target: "http://192.168.3.81:8091",//服务器api地址
        // target: "https://192.168.0.105",//服务器api地址
        target: "http://101.132.242.122:8091",//服务器api地址
        changeOrigin: true,//是否跨域
        pathRewrite: {//重写路径
            "/room": '/room'
        }
      }
    }
  },
  publicPath: '/'
}