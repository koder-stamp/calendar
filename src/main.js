import Vue from 'vue'
import App from './App.vue'
import store from './store'
import moment from 'moment';
Vue.prototype.$moment = moment;
Vue.config.productionTip = false
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTimes, faStar, faCalendar, faUser, faPen, faTrashAlt  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUserSecret, faTimes, faStar, faCalendar, faUser, faPen, faTrashAlt)


Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
