module.exports = {
  devServer: {
    index: 'https://localhost:8080/index',
    https: true,
    // host: '192.168.0.116',
    // port: 8080,
    proxy: {
      '/room': {//代理api
        // target: "http://192.168.3.79:8091",//服务器api地址
        target: "http://192.168.0.116:8091",//服务器api地址
        changeOrigin: true,//是否跨域
        ws: true, // proxy websockets
        pathRewrite: {//重写路径
            "/room": '/room'
        }
      }
    }
  },
  publicPath: '/'
}