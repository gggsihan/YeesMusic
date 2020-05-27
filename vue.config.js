var path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'common' : resolve('src/common'),
        'api' : resolve('src/api')
      }
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.113.108.204:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
