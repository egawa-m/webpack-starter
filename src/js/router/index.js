import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from '../components/Top'
import About from '../components/About'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
  ],
  scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
})
