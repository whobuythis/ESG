const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  lintOnSave: false,
  outputDir: "../src/main/resources/static",
  indexPath: "../templates/index.html",
  publicPath:  '/esgsolutions',
  devServer: {
    port: 8070, //프론트 포트 package.json도 수정
    proxy: {
      '/api': {
        // '/api'로 들어오면 포트 8080(스프링 서버)으로 proxy 처리
        target: 'http://localhost:8080', //target 포트는 백 포트와 동일
        ws : true,
        changeOrigin: true, //cross origin 허용 : 서로 다른 출처의 리소스 공유(CORS)
        logLevel: 'debug', //터미널에 proxy 로그가 찍힘
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
};
