import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueDaumPostcode from "vue-daum-postcode"
import { language } from '@/resources/lang/kr/common'
import VueGoogleCharts from 'vue-google-charts'
import { storage } from "./resources/storage/storage"

Vue.config.productionTip = false
Vue.prototype.$language = language

Vue.use(VueDaumPostcode)
Vue.use(VueGoogleCharts)


if(window.location.href.indexOf(process.env.VUE_APP_DOMAIN) > -1){
  Vue.prototype.$production = true
  Vue.prototype.$production_title = process.env.VUE_APP_TITLE
}else{
  Vue.prototype.$production = false
  Vue.prototype.$production_title = process.env.VUE_APP_TITLE_DEV
}

Vue.prototype.$storage = storage
Vue.prototype.$pdt_img_url = process.env.VUE_APP_IMG_URL
Vue.prototype.$server_url = process.env.VUE_APP_SERVER

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
