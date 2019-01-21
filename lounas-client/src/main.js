import Vue from 'vue'
import App from './App.vue'

import VueResource from 'vue-resource'

import './styles.scss'

Vue.config.productionTip = false

Vue.use(VueResource);


//Vue.http.options.root = 'http://localhost:1234';
Vue.http.options.root = 'https://lounas-app-api.herokuapp.com';
//Vue.http.options.root = 'https://lounaat-keilaranta-api.azurewebsites.net'; maxaa


new Vue({
  render: h => h(App),
}).$mount('#app')
