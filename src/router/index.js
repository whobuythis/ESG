import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import Dashboard from '@/views/Dashboard.vue'
import Index from '@/views/index.vue'
import Scope from '@/views/Scope'
import Solutions from '@/views/Solutions'
import Consulting from '@/views/Consulting'

Vue.use(Router)

function requireAuth(to, from, next) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn && to.path !== '/login' && to.path !== '/signup') {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: requireAuth,
      children: [
        {
          path: '',
          redirect: { name: 'Index' }
        },
        {
          path: 'index',
          name: 'Index',
          component: Index
        },
        {
          path: 'scope',
          name: 'Scope',
          component: Scope
        },
        {
          path: 'solutions',
          name: 'Solutions',
          component: Solutions
        },
        {
          path: 'consulting',
          name: 'Consulting',
          component: Consulting
        }
      ]
    }
  ]
})
