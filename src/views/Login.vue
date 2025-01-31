<template>
  <div class="login-container">
    <div class="login-form">
      <h1><strong>Hola!</strong></h1>
      <p>Ingrese sus datos de acceso para iniciar sesión.</p>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-password-container">
          <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" />
          <span class="input-group-text" @click="toggleShowPassword">
            <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
          </span>
        </div>
      </div>
      <div class="form-actions">
        <div class="remember-me">
          <input id="remember-me" v-model="rememberMe" type="checkbox" />
          <label for="remember-me">Recordarme</label>
        </div>
        <a href="#" class="fw-semibold">Recuperar Contraseña</a>
      </div>
      <button class="btn btn-primary w-100" @click="login">Ingresar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false
    }
  },
  methods: {
    login() {
      // console.log('Email:', this.email)
      // console.log('Password:', this.password)
      // console.log('Remember Me:', this.rememberMe)
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
