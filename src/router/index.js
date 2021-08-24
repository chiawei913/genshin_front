import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '《原神》 - 前往未知的冒險旅程'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    meta: {
      login: true,
      title: '後臺首頁'
    }
  },
  {
    path: '/country',
    name: 'Country',
    component: () => import(/* webpackChunkName: "country" */ '../views/Country.vue'),
    meta: {
      login: true,
      title: '國家設定'
    }
  },
  {
    path: '/city',
    name: 'City',
    component: () => import(/* webpackChunkName: "city" */ '../views/City.vue'),
    meta: {
      login: true,
      title: '城鎮設定'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import(/* webpackChunkName: "news" */ '../views/News.vue'),
    meta: {
      login: true,
      title: '新聞管理'
    }
  },
  {
    path: '/newscarousel',
    name: 'Newscarousel',
    component: () => import(/* webpackChunkName: "newscarousel" */ '../views/Newscarousel.vue'),
    meta: {
      login: true,
      title: '新聞輪播管理'
    }
  },
  {
    path: '/character',
    name: 'Character',
    component: () => import(/* webpackChunkName: "character" */ '../views/Character.vue'),
    meta: {
      login: true,
      title: '角色管理'
    }
  },
  {
    path: '/feature',
    name: 'Feature',
    component: () => import(/* webpackChunkName: "feature" */ '../views/Feature.vue'),
    meta: {
      login: true,
      title: '特色管理'
    }
  },
  {
    path: '/attribute',
    name: 'Attribute',
    component: () => import(/* webpackChunkName: "Attribute" */ '../views/Attribute.vue'),
    meta: {
      login: true,
      title: '屬性管理'
    }
  },
  // {
  //   path: '/message',
  //   name: 'Message',
  //   component: () => import(/* webpackChunkName: "Message" */ '../views/Message.vue'),
  //   meta: {
  //     login: true,
  //     title: '留言管理'
  //   }
  // },
  {
    path: '/backaccount',
    name: 'BackAccount',
    component: () => import(/* webpackChunkName: "BackAccount" */ '../views/BackAccount.vue'),
    meta: {
      login: true,
      admin: true,
      title: '後台帳戶管理'
    }
  },
  // {
  //   path: '/badperson',
  //   name: 'Badperson',
  //   component: () => import(/* webpackChunkName: "Badperson" */ '../views/Badperson.vue'),
  //   meta: {
  //     login: true,
  //     admin: true,
  //     title: '黑名單'
  //   }
  // },
  // {
  //   path: '/frontaccount',
  //   name: 'FrontAccount',
  //   component: () => import(/* webpackChunkName: "FrontAccount" */ '../views/FrontAccount.vue'),
  //   meta: {
  //     login: true,
  //     admin: true,
  //     title: '前台帳戶管理'
  //   }
  // },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      login: true,
      admin: true,
      title: '新增後台使用者'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      title: '登入'
    }
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log(store.state.user)
  if (to.meta.login && store.state.user.account.length === 0) {
    next('/login')
  } else if (to.meta.admin && store.state.user.role !== 1) {
    next('/admin')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
