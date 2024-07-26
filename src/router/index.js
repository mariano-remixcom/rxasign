import AdminLayout from '../layouts/admin/AdminLayout.vue'
import DefaultLayout from '../layouts/default/DefaultLayout.vue'
import LoginLayout from '../layouts/login/LoginLayout.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const history = createWebHashHistory()
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: {
      layout: DefaultLayout
    }
  },
  {
    path: '/proyectos',
    children: [
      {
        path: '',
        name: 'Proyectos',
        component: () => import(/* webpackChunkName: "proyectos" */ '../views/Proyectos.vue')
      },
      {
        path: 'agregar',
        name: 'Agregar Proyecto',
        component: () => import(/* webpackChunkName: "proyectosagregar" */ '../views/ProyectosAgregar.vue'),
        meta: {
          layout: AdminLayout
        }
      },

      {
        path: ':id',
        name: 'VerProyecto',
        component: () => import('../views/proyectos/VerProyecto.vue'),
        meta: {
          layout: DefaultLayout
        }
      }
    ]
  },
  {
    path: '/horas',
    name: 'Registro de horas',
    component: () => import(/* webpackChunkName: "horas" */ '../views/Horas.vue'),
    meta: {
      layout: DefaultLayout
    }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import(/* webpackChunkName: "usuarios" */ '../views/Usuarios.vue'),
    meta: {
      layout: DefaultLayout
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: LoginLayout
    }
  }
]

const router = createRouter({
  linkActiveClass: 'active',
  history,
  routes
})

export { router }
