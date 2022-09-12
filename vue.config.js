const { defineConfig } = require('@vue/cli-service')


const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,  // 关闭 eslint 提示
  transpileDependencies: true,
  outputDir: 'dist',
  devServer: {
    // allowedHosts: [
    //   'http://yghomeapi.lianghongyi.com/',
    // ],
    // disableHostCheck: true,  // 开发阶段，跳过 host 检查，实现内网穿透 webpack5 已经废弃
    historyApiFallback: true,
    allowedHosts: "all",
    host: '127.0.0.1',
    port: '8080',
    proxy: { // 配置跨域
      '/api': {
        target: 'http://localhost:6001/',   //请求接口域名  
        ws: true,
        // secure: false,
        changOrigin: true,    //是否允许跨越
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },
  },
  // 配置svg
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
}
