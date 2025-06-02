import AdminLayout from '../layouts/admin/AdminLayout.vue'
import AuthService from '@/services/auth'
import DefaultLayout from '../layouts/default/DefaultLayout.vue'
import LoginLayout from '../layouts/login/LoginLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()
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
          layout: AdminLayout
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
  }
]

const router = createRouter({
  linkActiveClass: 'active',
  history,
  routes
})

// TODO: This should update when the user logs in or out
// Remover esta línea:
// const isAuthenticated = await new AuthService().isAuthenticated()

router.beforeEach(async (to, from) => {
  const publicRoutes = ['Login', 'RecuperarPassword', 'RestablecerPassword']

  // Si es una ruta pública, permitir acceso sin verificar autenticación
  if (publicRoutes.includes(to.name)) {
    return true
  }

  // Para rutas protegidas, verificar autenticación en cada navegación
  try {
    const authService = new AuthService()
    const user = await authService.isAuthenticated()

    if (user) {
      return true // Usuario autenticado, permitir acceso
    } else {
      return { name: 'Login' } // No autenticado, redirigir a login
    }
  } catch (error) {
    // Error en verificación (conexión, servidor, etc.)
    return { name: 'Login' }
  }
})

export { router }
