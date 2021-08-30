import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueDaumPostcode from "vue-daum-postcode"
import { language } from '@/resources/lang/kr/common'

Vue.config.productionTip = false
Vue.prototype.$language = language

Vue.use(VueDaumPostcode)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
