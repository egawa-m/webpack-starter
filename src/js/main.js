import svg4everybody from 'svg4everybody'
import Vue from 'vue'
import App from './components/App'
import router from './router/'
import store from './store/'
import Fade from './module/fade'

import '../svg/icons/sns-twitter.svg'

document.addEventListener('DOMContentLoaded', () => {
  svg4everybody()

  if (document.getElementById('app')) {
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
    })
  }

  new Fade()
})
