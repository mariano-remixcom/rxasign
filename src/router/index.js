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
    children: [
      {
        path: '',
        name: 'Proyectos',
        component: () => import(/* webpackChunkName: "proyectos" */ '../views/Proyectos.vue'),
        meta: {
          layout: 'default'
        }
      },
      {
        path: ':id',
        name: 'VerProyecto',
        component: () => import('../views/proyectos/VerProyecto.vue'),
        meta: {
          layout: 'default'
        }
      }
    ]
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
  },
  {
    path: '/proyectos/editar',
    name: 'Editar proyecto',
    component: () => import(/* webpackChunkName: "login" */ '../views/ProyectosEditar.vue'),
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
// import { createRouter, createWebHistory } from 'vue-router';
// import Vue from 'vue';
// import Dashboard from '../views/Dashboard.vue';
// import Proyectos from '../views/Proyectos.vue';
// import Horas from '../views/Horas.vue';
// import Usuarios from '../views/Usuarios.vue';

// Vue.use(Router);

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Dashboard',
//       component: Dashboard
//     },
//     {
//       path: '/proyectos',
//       name: 'Proyectos',
//       component: Proyectos
//     },
//     {
//       path: '/horas',
//       name: 'Horas',
//       component: Horas
//     },
//     {
//       path: '/usuarios',
//       name: 'Usuarios',
//       component: Usuarios
//     },
//   ]
// });
