
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 引入请求方法文件
import 'api/request.js'
Vue.config.productionTip = false

App.mpType = 'app'

// 封装消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif