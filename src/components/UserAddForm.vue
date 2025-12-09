<template>
  <div class="container">
    <div class="section-header-primary mb-0" role="alert">Datos del usuario</div>
    <div class="user-add-form">
      <form @submit.prevent="submitForm">
        <!-- Nombre -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="firstName" class="h6 mb-0">Nombre</label>
            <small>Ingrese el nombre del usuario</small>
          </div>
          <div class="col-12 col-md-8">
            <input
              id="firstName"
              v-model="user.firstName"
              type="text"
              class="form-control bg-white"
              required
              @input="updateData"
              @blur="v$.user.firstName.$touch"
            />
            <div v-if="v$.user.firstName.$error" class="text-danger">El nombre es requerido.</div>
          </div>
        </div>

        <!-- Apellido -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="lastName" class="h6 mb-0">Apellido</label>
            <small>Ingrese el apellido del usuario</small>
          </div>
          <div class="col-12 col-md-8">
            <input
              id="lastName"
              v-model="user.lastName"
              type="text"
              class="form-control bg-white"
              required
              @input="updateData"
              @blur="v$.user.lastName.$touch"
            />
            <div v-if="v$.user.lastName.$error" class="text-danger">El apellido es requerido.</div>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="email" class="h6 mb-0">Email</label>
            <small>Correo electrónico del usuario</small>
          </div>
          <div class="col-12 col-md-8">
            <input
              id="email"
              v-model="user.email"
              type="email"
              class="form-control bg-white"
              required
              @input="updateData"
              @blur="v$.user.email.$touch"
            />
            <div v-if="v$.user.email.$error" class="text-danger">El email es requerido y debe ser válido.</div>
          </div>
        </div>

        <!-- Tipo de Usuario -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="type" class="h6 mb-0">Tipo de Usuario</label>
            <small>Nivel de permisos del usuario</small>
          </div>
          <div class="col-12 col-md-8">
            <select id="type" v-model="user.type" class="form-select" required @change="updateData" @blur="v$.user.type.$touch">
              <option value="" disabled>Seleccione un tipo</option>
              <option v-for="userType in userTypes" :key="userType.key" :value="userType.key">
                {{ userType.displayName }}
              </option>
            </select>
            <div v-if="v$.user.type.$error" class="text-danger">El tipo de usuario es requerido.</div>
          </div>
        </div>

        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="contractType" class="h6 mb-0">Tipo de Contratación</label>
            <small>Tipo de vinculación del usuario</small>
          </div>

          <div class="col-12 col-md-8">
            <select
              id="contractType"
              v-model="user.contractType"
              class="form-select"
              required
              @change="updateData"
              @blur="v$.user.contractType.$touch"
            >
              <option value="" disabled>Seleccione tipo de contratación</option>
              <option v-for="contract in contractTypes" :key="contract.key" :value="contract.key">
                {{ contract.displayName }}
              </option>
            </select>

            <div v-if="v$.user.contractType.$error" class="text-danger">El tipo de contratación es requerido.</div>
          </div>
        </div>

        <!-- Rol -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="preferredRole" class="h6 mb-0">Rol</label>
            <small>Rol principal del usuario (opcional)</small>
          </div>
          <div class="col-12 col-md-8">
            <select id="preferredRole" v-model="user.preferredRole" class="form-select" @change="updateData">
              <option :value="null">Sin rol asignado</option>
              <option v-for="role in userRoles" :key="role.key" :value="role.key">
                {{ role.displayName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Horas Contratadas Mensuales -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="monthlyContractedHours" class="h6 mb-0">Horas Mensuales</label>
            <small>Cantidad de horas contratadas por mes</small>
          </div>
          <div class="col-12 col-md-8">
            <input
              id="monthlyContractedHours"
              v-model="user.monthlyContractedHours"
              type="number"
              class="form-control bg-white"
              min="0"
              step="0.5"
              required
              @change="updateData"
              @blur="v$.user.monthlyContractedHours.$touch"
            />
            <div v-if="v$.user.monthlyContractedHours.$error" class="text-danger">
              Las horas contratadas son requeridas y deben ser mayor a 0.
            </div>
          </div>
        </div>

        <!-- Avatar URL -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="avatar" class="h6 mb-0">Avatar</label>
            <small>URL de la imagen de perfil (opcional)</small>
          </div>
          <div class="col-12 col-md-8">
            <input
              id="avatar"
              v-model="user.avatar"
              type="url"
              class="form-control bg-white"
              placeholder="https://ejemplo.com/avatar.jpg"
              @input="updateData"
            />
          </div>
        </div>

        <!-- Estado Activo -->
        <div class="mb-3 row align-items-center">
          <div class="col-12 col-md-4 d-flex flex-column">
            <label for="isActive" class="h6 mb-0">Estado</label>
            <small>¿El usuario está activo?</small>
          </div>
          <div class="col-12 col-md-8">
            <div class="form-check form-switch">
              <input id="isActive" v-model="user.isActive" class="form-check-input" type="checkbox" @change="updateData" />
              <label class="form-check-label" for="isActive">
                {{ user.isActive ? 'Activo' : 'Inactivo' }}
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { CONTRACT_TYPES } from '@/constants/ContractTypes'
import { USER_ROLES } from '@/constants/UserRoles'
import { USER_TYPES } from '@/constants/UserTypes'
import { email, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

export default {
  name: 'UserAddForm',
  emits: ['update-data'],
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        type: '',
        contractType: '',
        preferredRole: null,
        monthlyContractedHours: '',
        avatar: '',
        isActive: true
      },
      userTypes: USER_TYPES,
      userRoles: USER_ROLES,
      contractTypes: CONTRACT_TYPES
    }
  },
  validations() {
    return {
      user: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
        type: { required },
        contractType: { required },
        monthlyContractedHours: {
          required,
          minValue: minValue(1)
        }
      }
    }
  },
  methods: {
    updateData() {
      console.log('contractType seleccionado:', this.user.contractType)
      this.$emit('update-data', this.user)
    },
    async submitForm() {
      const isFormCorrect = await this.v$.$validate()

      return isFormCorrect
    }
  }
}
</script>
<style scoped>
.user-add-form {
  padding: 18px 10px;
  border-radius: 8px;
  margin: 0 auto;
  width: 100%;
}

small {
  color: var(--bs-gray-500);
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
  .col-md-4 {
    margin-bottom: 10px;
  }
}
</style>
