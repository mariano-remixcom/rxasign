import { createRouter, createWebHashHistory } from 'vue-router'

const history = createWebHashHistory()
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/proyectos',
    name: 'Proyectos',
    component: () => import(/* webpackChunkName: "proyectos" */ '../views/Proyectos.vue'),
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/proyectos/agregar',
    name: 'Agregar Proyecto',
    component: () => import(/* webpackChunkName: "proyectosagregar" */ '../views/ProyectosAgregar.vue'),
    meta: {
      layout: 'admin' // Cambiar layout a 'admin'
    }
  },
  {
    path: '/horas',
    name: 'Registro de horas',
    component: () => import(/* webpackChunkName: "horas" */ '../views/Horas.vue'),
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import(/* webpackChunkName: "usuarios" */ '../views/Usuarios.vue'),
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: 'default'
    }
  }
]

const router = createRouter({
  linkActiveClass: 'active',
  history,
  routes
})

export { router }
