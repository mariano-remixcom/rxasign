<template>
  <div id="app" class="container">
    <div class="pb-4 mb-4 page-title-separation">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="me-auto">
          <h1 class="h3 mb-0 fw-semibold">Agregar usuario</h1>
        </div>
        <div class="d-flex gap-2">
          <router-link to="/usuarios">
            <button class="btn btn-soft-primary w-100 w-sm-auto">Cancelar</button>
          </router-link>
          <button class="btn btn-primary w-100 w-sm-auto" @click="submitForm">Guardar</button>
        </div>
      </div>
    </div>
    <div>
      <UserAddForm ref="userAddForm" @update-data="onUpdateDataUser" />
    </div>
  </div>
</template>

<script>
import UserAddForm from '@/components/UserAddForm.vue'
import UsersService from '@/services/users'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export default {
  name: 'UsuariosAgregar',
  components: {
    UserAddForm
  },
  data() {
    return {
      user: null
    }
  },
  methods: {
    async submitForm() {
      const formUser = this.$refs.userAddForm
      const formUserValid = await formUser.submitForm()

      if (formUserValid) {
        this.addUser()
      }
    },

    async addUser() {
      try {
        const userData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          type: typeof this.user.type === 'object' ? this.user.type.key : this.user.type,
          contractType: typeof this.user.contractType === 'object' ? this.user.contractType.key : this.user.contractType,
          monthlyContractedHours: parseFloat(this.user.monthlyContractedHours),
          isActive: this.user.isActive
        }

        // Agregar campos opcionales solo si tienen valor
        if (this.user.password) {
          userData.password = this.user.password
        }

        // Extraer solo la key del rol si existe
        if (this.user.preferredRole) {
          userData.preferredRole =
            typeof this.user.preferredRole === 'object' ? this.user.preferredRole.key : this.user.preferredRole
        }

        if (this.user.avatar) {
          userData.avatar = this.user.avatar
        }

        const response = await new UsersService().createUser(userData)

        if (response.status === 201) {
          const { addToast } = useToaster()

          addToast('Usuario creado exitosamente.', 'success')
          this.$router.push({ name: 'Usuarios' })
        }
      } catch (error) {
        const { addToast } = useToaster()

        if (error.response?.status === 409) {
          addToast('Ya existe un usuario con ese email.', 'danger')
        } else {
          addToast('Error al crear el usuario.', 'danger')
        }
        console.error('Error al crear usuario:', error)
      }
    },

    onUpdateDataUser(updatedUser) {
      this.user = updatedUser
    }
  }
}
</script>

<style scoped>
.page-title-separation {
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .page-title-separation {
    text-align: left;
  }

  .d-flex.gap-2 {
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }

  .w-sm-auto {
    width: auto !important;
  }
}
</style>
