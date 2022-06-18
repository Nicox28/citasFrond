const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://192.168.1.10:8000/',
    port: 3000,
    
  }
})


