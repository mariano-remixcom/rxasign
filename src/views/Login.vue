<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="login">
      <h1><strong>Hola!</strong></h1>
      <p>Ingrese sus datos de acceso para iniciar sesión.</p>
      <div class="form-group custom-form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" />
      </div>
      <div class="form-group custom-form-group">
        <label for="password">Password</label>
        <div class="input-password-container">
          <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" />
          <span class="input-group-text" @click="toggleShowPassword">
            <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
          </span>
        </div>
      </div>
      <div class="form-group">
        <div class="form-check">
          <input id="rememberMe" v-model="rememberMe" type="checkbox" class="form-check-input" />
          <label for="rememberMe" class="form-check-label d-flex"> Recordarme</label>
        </div>
      </div>
      <div class="form-actions">
        <router-link to="/recuperar" class="fw-semibold">Restablecer Contraseña</router-link>
      </div>
      <button type="submit" class="btn btn-primary w-100">Ingresar</button>
    </form>
  </div>
</template>

<script>
import AuthService from '../services/auth'
import { useSession } from '@/composables/session/useSession'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      rememberMe: false
    }
  },
  async mounted() {
    const { isAuthenticated } = useSession()

    if (await isAuthenticated()) {
      this.$router.push({ name: 'Valores' })
    }
  },
  methods: {
    async login() {
      const { addToast } = useToaster()

      if (this.email === '' || this.password === '') {
        return addToast('Por favor, complete todos los campos.', 'warning')
      }

      const authService = new AuthService()

      try {
        const { data } = await authService.login(this.email, this.password, this.rememberMe)
        const { setSession } = useSession()

        setSession(data)

        await this.$nextTick()

        this.$router.replace({ name: 'Valores' })
      } catch (error) {
        if (error.response && error.response.status === 401) {
          addToast(error.response.data, 'danger')
        } else if (error.response && error.response.status === 500) {
          addToast('Error interno del servidor.', 'danger')
        } else {
          addToast('Error al iniciar sesión.', 'danger')
          console.error('Error al iniciar sesión:', error)
        }
      }
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style scoped lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-form {
  background: white;
  padding: 40px 50px;
  width: 500px;
  text-align: center;
  margin-top: calc((100vh - 700px) / 2);
}

h1 {
  margin-bottom: 15px;
  font-size: 40px;
}

p {
  margin-bottom: 25px;
  color: #666;
  font-size: 18px;
}

.custom-form-group {
  margin-bottom: 20px;
  position: relative;
}

.custom-form-group label {
  display: block;
  font-size: 0.9em;
  color: #837d7d;
  margin-bottom: 8px;
  text-align: left;
}

.custom-form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.input-password-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-password-container input {
  flex: 1;
  border: none;
  padding: 12px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.input-password-container .input-group-text {
  padding: 9px 12px;
  border-left: 1px solid #ccc;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
}
</style>
