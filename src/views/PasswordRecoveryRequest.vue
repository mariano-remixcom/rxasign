<template>
  <div class="recovery-container">
    <div class="recovery-form">
      <h1><strong>Restablecer contraseña</strong></h1>
      <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

      <div v-if="message" class="alert" :class="messageType">
        {{ message }}
      </div>

      <div class="form-group">
        <label for="recovery-email">Email</label>
        <input id="recovery-email" v-model.trim="email" type="email" required placeholder="correo@ejemplo.com" />
      </div>

      <button class="btn btn-primary w-100" :disabled="loading" @click="requestRecovery">
        <span v-if="loading">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Enviando...
        </span>
        <span v-else> Enviar </span>
      </button>

      <div class="back-link">
        <router-link to="/login">Volver al inicio de sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth'
import { useToaster } from '@/helpers/alerts/toasts/useToaster'

export default {
  data() {
    return {
      email: '',
      message: '',
      messageType: '',
      loading: false,
      authService: new AuthService()
    }
  },
  methods: {
    async requestRecovery() {
      this.message = ''
      this.messageType = ''

      if (!this.validateEmail()) {
        this.message = 'Por favor ingresa un correo electrónico válido'
        this.messageType = 'alert-danger'

        return
      }

      this.loading = true

      try {
        const response = await this.authService.requestPasswordRecovery(this.email)

        if (response?.data?.message) {
          useToaster('success', response.data.message || 'Enlace enviado.')
        }
        this.email = ''
      } catch (error) {
        const errMsg = error.response?.data?.error || 'Error al procesar la solicitud.'

        useToaster('error', errMsg)
      } finally {
        this.loading = false
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      return emailRegex.test(this.email)
    }
  }
}
</script>

<style scoped lang="scss">
.recovery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.recovery-form {
  background: white;
  padding: 40px 50px;
  width: 500px;
  text-align: center;
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

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.9em;
  color: #837d7d;
  margin-bottom: 8px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.alert {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.back-link {
  margin-top: 20px;
}

button {
  padding: 12px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
