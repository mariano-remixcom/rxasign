<!-- <template>
  <div class="container mt-5">
    <div class="p-5 mb-4 box rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Login</h1>
        <b-form @submit.prevent="handleSubmit">
          <b-form-group label="Email" label-for="email">
            <b-form-input
              id="email"
              type="email"
              v-model="email"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Password" label-for="password">
            <b-form-input
              id="password"
              type="password"
              v-model="password"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary" block>Login</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');
    const router = useRouter();

    const handleSubmit = () => {
      // Simulación de autenticación
      if (email.value === 'user@example.com' && password.value === 'password') {
        // Redirigir al dashboard u otra ruta protegida
        router.push('/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    };

    return {
      email,
      password,
      handleSubmit
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
 -->
