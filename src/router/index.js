import DefaultLayout from '../layouts/default/DefaultLayout.vue'
import FormsLayout from '../layouts/admin/FormsLayout.vue'
import LoginLayout from '../layouts/login/LoginLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useLocalHistory } from '@/composables/navigation/useNavigateBack'
import { useSession } from '@/composables/session/useSession'

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'Valores',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Valores.vue'),
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
    path: '/horas',
    name: 'Horas',
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
    path: '/agregar',
    name: 'Agregar Usuario',
    component: () => import(/* webpackChunkName: "proyectosagregar" */ '../views/UsuariosAgregar.vue'),
    meta: {
      layout: FormsLayout
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      layout: LoginLayout
    }
  },
  {
    path: '/recuperar',
    name: 'RecuperarPassword',
    component: () => import(/* webpackChunkName: "recuperar" */ '../views/PasswordRecoveryRequest.vue'),
    meta: {
      layout: LoginLayout
    }
  },
  {
    path: '/recuperar/:token',
    name: 'RestablecerPassword',
    component: () => import(/* webpackChunkName: "restablecer" */ '../views/PasswordReset.vue'),
    meta: {
      layout: LoginLayout
    }
  },
  {
    path: '/daily',
    name: 'DailyReport',
    component: () => import(/* webpackChunkName: "daily" */ '../views/daily/DailyReport.vue'),
    meta: {
      layout: DefaultLayout
    }
  }
]

const router = createRouter({
  linkActiveClass: 'active',
  history,
  routes
})

const { isAuthenticated } = useSession()
const { incrementLocalHistory } = useLocalHistory()
const publicRoutes = ['Login', 'RecuperarPassword', 'RestablecerPassword']

router.beforeEach(async (to, from) => {
  incrementLocalHistory()

  if (!publicRoutes.includes(to.name) && !(await isAuthenticated())) {
    return { name: 'Login' }
  }
})

export { router }
