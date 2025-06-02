import DefaultLayout from '../layouts/default/DefaultLayout.vue'
import FormsLayout from '../layouts/admin/FormsLayout.vue'
import LoginLayout from '../layouts/login/LoginLayout.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useSession } from '@/helpers/session/useSession'

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
        path: ':status(success)?',
        name: 'Proyectos',
        component: () => import(/* webpackChunkName: "proyectos" */ '../views/Proyectos.vue')
      },
      {
        path: 'agregar',
        name: 'Agregar Proyecto',
        component: () => import(/* webpackChunkName: "proyectosagregar" */ '../views/ProyectosAgregar.vue'),
        meta: {
          layout: FormsLayout
        }
      },
      {
        path: ':id(\\d+)', // Match only numbers for ids
        name: 'VerProyecto',
        component: () => import('../views/proyectos/VerProyecto.vue'),
        meta: {
          layout: DefaultLayout
        }
      }
    ]
  },
  {
    path: '/registro-horas',
    name: 'Registro de horas',
    component: () => import(/* webpackChunkName: "horas" */ '../views/RegistroHoras.vue'),
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

const { isAuthenticated } = useSession()

router.beforeEach(async (to, from) => {
  // If user is not logged then redirect to login
  if (!(await isAuthenticated()) && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export { router }
