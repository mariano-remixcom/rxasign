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
        <input id="password" v-model="password" type="password" />
      </div>
      <div class="form-actions">
        <div class="remember-me">
          <input id="remember-me" v-model="rememberMe" type="checkbox" />
          <label for="remember-me">Recordarme</label>
        </div>
        <a href="#" class="forgot-password">Recuperar Contraseña</a>
      </div>
      <button class="login-button" @click="login">Ingresar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false
    }
  },
  methods: {
    login() {
      console.log('Email:', this.email)
      console.log('Password:', this.password)
      console.log('Remember Me:', this.rememberMe)
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

.toggle-password {
  position: absolute;
  right: 10px;
  top: 38px;
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
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

.forgot-password {
  font-size: 1em;
  color: #6c63ff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: #6c63ff;
  color: white;
  font-size: 1em;
  cursor: pointer;
}

.login-button:hover {
  background-color: #594ad3;
}
</style>
