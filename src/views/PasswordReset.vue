<template>
  <div class="reset-container">
    <div class="reset-form">
      <h1><strong>Crear nueva contraseña</strong></h1>
      <p>Ingresa tu nueva contraseña a continuación.</p>

      <div v-if="!expired && !completed">
        <div class="form-group">
          <label for="new-password">Nueva contraseña</label>
          <div class="input-password-container">
            <input id="new-password" v-model="password" :type="showPassword ? 'text' : 'password'" />
            <span class="input-group-text" @click="toggleShowPassword">
              <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </span>
          </div>
          <!-- <span class="error-message" v-if="passwordError">{{ passwordError }}</span> -->
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirmar contraseña</label>
          <div class="input-password-container">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              @input="validateFields"
            />
            <span class="input-group-text" @click="toggleShowConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </span>
          </div>
          <span v-if="confirmError" class="error-message">{{ confirmError }}</span>
        </div>

        <div class="password-requirements">
          <p>La contraseña debe:</p>
          <ul>
            <li :class="{ 'requirement-met': password.length >= 8 }">Tener al menos 8 caracteres</li>
            <li :class="{ 'requirement-met': /[A-Z]/.test(password) }">Contener al menos una letra mayúscula</li>
            <li :class="{ 'requirement-met': /\d/.test(password) }">Contener al menos un número</li>
          </ul>
        </div>

        <button class="btn btn-primary w-100" @click="resetPassword">
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Actualizando...
          </span>
          <span v-else> Actualizar contraseña </span>
        </button>
      </div>

      <div v-if="completed" class="success-message">
        <i class="bi bi-check-circle-fill"></i>
        <p>Tu contraseña ha sido actualizada correctamente.</p>
        <router-link to="/login" class="btn btn-primary">Iniciar sesión</router-link>
      </div>

      <div v-if="expired" class="expired-message">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <p>El enlace ha expirado o no es válido.</p>
        <router-link to="/recuperar" class="btn btn-secondary">Solicitar nuevo enlace</router-link>
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
      token: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      passwordError: '',
      confirmError: '',
      loading: false,
      expired: false,
      completed: false,
      authService: new AuthService()
    }
  },
  computed: {
    isValidForm() {
      return (
        this.password.length >= 8 &&
        /[A-Z]/.test(this.password) &&
        /\d/.test(this.password) &&
        this.password === this.confirmPassword
      )
    }
  },
  created() {
    this.token = this.$route.params.token
    if (!this.token) {
      this.expired = true
    } else {
      this.validateToken()
    }
  },
  methods: {
    async validateToken() {
      try {
        await this.authService.validateToken(this.token)
      } catch (error) {
        this.expired = true
      }
    },
    async resetPassword() {
      if (!this.validateFields()) return

      this.loading = true
      try {
        const response = await this.authService.resetPassword(this.token, this.password)

        if (response?.data?.message) {
          useToaster('success', response.data.message || 'Contraseña actualizada correctamente')
        }
        this.completed = true
      } catch (error) {
        const errMsg = error.response?.data?.error || 'Error al procesar la solicitud'

        useToaster('error', errMsg)

        if (errMsg.includes('Token')) this.expired = true
      } finally {
        this.loading = false
      }
    },
    validateFields() {
      let isValid = true

      this.passwordError = ''
      this.confirmError = ''

      const password = this.password
      const confirm = this.confirmPassword

      // if (password.length < 8) {
      //   this.passwordError = 'La contraseña debe tener al menos 8 caracteres.'
      //   isValid = false
      // } else if (!/[A-Z]/.test(password)) {
      //   this.passwordError = 'La contraseña debe contener al menos una letra mayúscula.'
      //   isValid = false
      // } else if (!/\d/.test(password)) {
      //   this.passwordError = 'La contraseña debe contener al menos un número.'
      //   isValid = false
      // }
      if (password !== confirm) {
        this.confirmError = 'Las contraseñas no coinciden.'
        isValid = false
      }

      return isValid
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    }
  }
}
</script>

<style scoped lang="scss">
.reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.reset-form {
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
  padding: 12px;
  border-left: 1px solid #ccc;
  cursor: pointer;
}

.password-requirements {
  text-align: left;
  margin-bottom: 20px;

  ul {
    padding-left: 20px;

    li {
      margin-bottom: 5px;

      &.requirement-met {
        color: green;
      }
    }
  }
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

.success-message,
.expired-message {
  text-align: center;

  i {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .bi-check-circle-fill {
    color: green;
  }

  .bi-exclamation-triangle-fill {
    color: orange;
  }
}

button {
  padding: 12px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 4px;
}

.input-password-container {
  display: flex;
  align-items: center;
}

.input-password-container input {
  flex: 1;
}

.input-group-text {
  cursor: pointer;
  padding: 0 8px;
}

.btn {
  margin-top: 20px;
}
</style>
