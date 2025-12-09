<template>
  <div class="container mt-4">
    <table class="table">
      <thead class="table-light">
        <tr>
          <th class="text-center" scope="col">Avatar</th>
          <th scope="col">Nombre</th>
          <th scope="col">Rol</th>
          <th scope="col">Tipo</th>
          <th scope="col" class="contract-col">Tipo de Contratación</th>
          <th class="text-center hours-col" scope="col">Horas Contratadas</th>
          <th v-if="isAdminUser" class="text-center" scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody class="align-middle">
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td data-label="Avatar">
            <div class="avatar-container">
              <i class="bi bi-person-circle avatar-fallback" :title="user.fullName"></i>
            </div>
          </td>
          <td data-label="Nombre">
            {{ user.fullName }}
          </td>
          <td data-label="Rol">
            {{ getRoleDisplayName(user.preferredRole) }}
          </td>
          <td data-label="Tipo">
            <span class="badge" :class="getTypeBadgeClass(user.type)">
              {{ getTypeDisplayName(user.type) }}
            </span>
          </td>
          <td data-label="Tipo de Contratación" class="text-center contract-col">
            <span class="badge" :class="getContractTypeBadgeClass(user.contractType)">
              {{ getContractTypeDisplayName(user.contractType) }}
            </span>
          </td>
          <td data-label="Horas Contratadas" class="text-center hours-col">{{ user.monthlyContractedHours }} hs</td>
          <td v-if="isAdminUser" data-label="Acciones">
            <div class="text-center action-buttons">
              <button class="btn btn-link btn-m" :title="'Ver perfil completo'" @click="viewUserProfile(user)">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-link btn-m" :title="'Editar usuario'" @click="editUserProfile(user)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button
                class="btn btn-link btn-m"
                :title="user.isActive ? 'Desactivar usuario' : 'Activar usuario'"
                @click="toggleUserStatus(user)"
              >
                <i :class="user.isActive ? 'bi bi-toggle-on' : 'bi bi-toggle-off'"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de Perfil de Usuario -->
    <div id="userProfileModal" class="modal fade" tabindex="-1" aria-labelledby="userProfileModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="userProfileModalLabel" class="modal-title">
              {{ isEditMode ? 'Editar Usuario' : 'Perfil de Usuario' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedUser" class="user-profile-form">
              <!-- Avatar -->
              <div class="mb-4 text-center">
                <div v-if="selectedUser.avatar" class="avatar-preview">
                  <img :src="selectedUser.avatar" :alt="selectedUser.fullName" class="rounded-circle" />
                </div>
                <div v-else class="avatar-preview-fallback">
                  <i class="bi bi-person-circle"></i>
                </div>
              </div>

              <!-- Nombre -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Nombre</label>
                  <small>Nombre del usuario</small>
                </div>
                <div class="col-12 col-md-8">
                  <input v-if="isEditMode" v-model="selectedUser.firstName" type="text" class="form-control bg-white" />
                  <p v-else class="form-control-plaintext">
                    {{ selectedUser.firstName }}
                  </p>
                </div>
              </div>

              <!-- Apellido -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Apellido</label>
                  <small>Apellido del usuario</small>
                </div>
                <div class="col-12 col-md-8">
                  <input v-if="isEditMode" v-model="selectedUser.lastName" type="text" class="form-control bg-white" />
                  <p v-else class="form-control-plaintext">
                    {{ selectedUser.lastName }}
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Email</label>
                  <small>Correo electrónico del usuario</small>
                </div>
                <div class="col-12 col-md-8">
                  <input v-if="isEditMode" v-model="selectedUser.email" type="email" class="form-control bg-white" />
                  <p v-else class="form-control-plaintext">
                    {{ selectedUser.email }}
                  </p>
                </div>
              </div>

              <!-- Tipo de Usuario -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Tipo de Usuario</label>
                  <small>Nivel de permisos del usuario</small>
                </div>
                <div class="col-12 col-md-8">
                  <select v-if="isEditMode" v-model="selectedUser.type" class="form-select">
                    <option v-for="userType in userTypes" :key="userType.key" :value="userType.key">
                      {{ userType.displayName }}
                    </option>
                  </select>
                  <p v-else class="form-control-plaintext">
                    <span class="badge" :class="getTypeBadgeClass(selectedUser.type)">
                      {{ getTypeDisplayName(selectedUser.type) }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Tipo de Contratación -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Tipo de Contratación</label>
                  <small>Modalidad de contratación</small>
                </div>
                <div class="col-12 col-md-8">
                  <select v-if="isEditMode" v-model="selectedUser.contractType" class="form-select">
                    <option v-for="contractType in contractTypes" :key="contractType.key" :value="contractType.key">
                      {{ contractType.displayName }}
                    </option>
                  </select>
                  <p v-else class="form-control-plaintext">
                    <span class="badge" :class="getContractTypeBadgeClass(selectedUser.contractType)">
                      {{ getContractTypeDisplayName(selectedUser.contractType) }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Rol -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Rol</label>
                  <small>Rol principal del usuario (opcional)</small>
                </div>
                <div class="col-12 col-md-8">
                  <select v-if="isEditMode" v-model="selectedUser.preferredRole" class="form-select">
                    <option :value="null">Sin rol asignado</option>
                    <option v-for="role in userRoles" :key="role.key" :value="role.key">
                      {{ role.displayName }}
                    </option>
                  </select>
                  <p v-else class="form-control-plaintext">
                    {{ getRoleDisplayName(selectedUser.preferredRole) }}
                  </p>
                </div>
              </div>

              <!-- Horas Contratadas Mensuales -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Horas Mensuales</label>
                  <small>Cantidad de horas contratadas por mes</small>
                </div>
                <div class="col-12 col-md-8">
                  <input
                    v-if="isEditMode"
                    v-model="selectedUser.monthlyContractedHours"
                    type="number"
                    class="form-control bg-white"
                    min="0"
                    step="0.5"
                  />
                  <p v-else class="form-control-plaintext">{{ selectedUser.monthlyContractedHours }} horas</p>
                </div>
              </div>

              <!-- Avatar URL -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Avatar</label>
                  <small>URL de la imagen de perfil (opcional)</small>
                </div>
                <div class="col-12 col-md-8">
                  <input
                    v-if="isEditMode"
                    v-model="selectedUser.avatar"
                    type="url"
                    class="form-control bg-white"
                    placeholder="https://ejemplo.com/avatar.jpg"
                  />
                  <p v-else class="form-control-plaintext text-break">
                    {{ selectedUser.avatar || 'No configurado' }}
                  </p>
                </div>
              </div>

              <!-- Estado Activo -->
              <div class="mb-3 row align-items-center">
                <div class="col-12 col-md-4 d-flex flex-column">
                  <label class="h6 mb-0">Estado</label>
                  <small>¿El usuario está activo?</small>
                </div>
                <div class="col-12 col-md-8">
                  <div v-if="isEditMode" class="form-check form-switch">
                    <input v-model="selectedUser.isActive" class="form-check-input" type="checkbox" />
                    <label class="form-check-label">
                      {{ selectedUser.isActive ? 'Activo' : 'Inactivo' }}
                    </label>
                  </div>
                  <p v-else class="form-control-plaintext">
                    <span class="badge" :class="selectedUser.isActive ? 'bg-success' : 'bg-secondary'">
                      {{ selectedUser.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button v-if="!isEditMode" type="button" class="btn btn-primary" @click="enableEditMode">Editar</button>
            <button v-if="isEditMode" type="button" class="btn btn-primary" @click="saveUserChanges">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Activar/Desactivar -->
    <div id="toggleStatusModal" class="modal fade" tabindex="-1" aria-labelledby="toggleStatusModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="toggleStatusModalLabel" class="modal-title">Confirmar Acción</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p v-if="userToToggle">
              ¿Está seguro que desea {{ userToToggle.isActive ? 'desactivar' : 'activar' }} al usuario
              <strong>{{ userToToggle.fullName }}</strong
              >?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="confirmToggleStatus">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersService from '@/services/users'
import { CONTRACT_TYPES } from '@/constants/ContractTypes'
import { Modal } from 'bootstrap'
import { USER_ROLES } from '@/constants/UserRoles'
import { USER_TYPES } from '@/constants/UserTypes'
import { useSetupSession } from '@/composables/session/useSetupSession'
import { useToaster } from '@/composables/alerts/toasts/useToaster'

export default {
  name: 'PerfilTable',
  props: {
    showActive: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return useSetupSession()
  },
  data() {
    return {
      usersService: new UsersService(),
      users: [],
      selectedUser: null,
      userToToggle: null,
      isEditMode: false,
      originalUserData: null,
      userRoles: USER_ROLES,
      userTypes: USER_TYPES,
      contractTypes: CONTRACT_TYPES,
      profileModal: null,
      toggleModal: null
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => user.isActive === this.showActive)
    }
  },
  mounted() {
    this.loadUsers()
    this.profileModal = new Modal(document.getElementById('userProfileModal'))
    this.toggleModal = new Modal(document.getElementById('toggleStatusModal'))
  },
  methods: {
    async loadUsers() {
      this.users = (await this.usersService.getAllUsersWithHoursData()).data
    },
    getRoleDisplayName(roleKey) {
      if (!roleKey) return '-'
      const role = this.userRoles.find((r) => r.key === roleKey)

      return role ? role.displayName : roleKey
    },
    getTypeDisplayName(typeKey) {
      if (!typeKey) return '-'
      const type = this.userTypes.find((t) => t.key === typeKey)

      return type ? type.displayName : typeKey
    },
    getContractTypeDisplayName(contractTypeKey) {
      if (!contractTypeKey) return 'Full Time'
      const contractType = this.contractTypes.find((ct) => ct.key === contractTypeKey)

      return contractType ? contractType.displayName : contractTypeKey
    },
    getTypeBadgeClass(type) {
      const classes = {
        EMPLOYEE: 'bg-primary',
        CONTRACTOR: 'bg-info',
        ADMIN: 'bg-warning'
      }

      return classes[type] || 'bg-secondary'
    },
    getContractTypeBadgeClass(contractType) {
      const classes = {
        FullTime: 'bg-success',
        PartTime: 'bg-info',
        Freelance: 'bg-warning'
      }

      return classes[contractType] || 'bg-success'
    },
    viewUserProfile(user) {
      this.selectedUser = { ...user }
      this.isEditMode = false
      this.profileModal.show()
    },
    editUserProfile(user) {
      this.selectedUser = { ...user }
      this.originalUserData = { ...user }
      this.isEditMode = true
      this.profileModal.show()
    },
    enableEditMode() {
      this.originalUserData = { ...this.selectedUser }
      this.isEditMode = true
    },
    async saveUserChanges() {
      try {
        const updateData = {
          firstName: this.selectedUser.firstName,
          lastName: this.selectedUser.lastName,
          email: this.selectedUser.email,
          type: this.selectedUser.type,
          contractType: this.selectedUser.contractType,
          preferredRole: this.selectedUser.preferredRole,
          monthlyContractedHours: this.selectedUser.monthlyContractedHours,
          avatar: this.selectedUser.avatar,
          isActive: this.selectedUser.isActive
        }

        await this.usersService.updateUser(this.selectedUser.id, updateData)

        // Actualizar en la lista local
        const index = this.users.findIndex((u) => u.id === this.selectedUser.id)

        if (index !== -1) {
          this.users[index] = { ...this.selectedUser }
        }

        this.showSuccessToast('Usuario actualizado exitosamente.')
        this.profileModal.hide()
        this.isEditMode = false
      } catch (error) {
        this.showErrorToast('Error al actualizar el usuario: ' + error.message)
      }
    },
    toggleUserStatus(user) {
      this.userToToggle = { ...user }
      this.toggleModal.show()
    },
    async confirmToggleStatus() {
      try {
        const newStatus = !this.userToToggle.isActive

        await this.usersService.updateUser(this.userToToggle.id, { isActive: newStatus })

        // Actualizar en la lista local
        const index = this.users.findIndex((u) => u.id === this.userToToggle.id)

        if (index !== -1) {
          this.users[index].isActive = newStatus
        }

        this.showSuccessToast(`Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente.`)
        this.toggleModal.hide()

        // Recargar usuarios para actualizar el filtro
        await this.loadUsers()
      } catch (error) {
        this.showErrorToast('Error al cambiar el estado del usuario: ' + error.message)
      }
    },
    showSuccessToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'success')
    },
    showErrorToast(message) {
      const { addToast } = useToaster()

      addToast(message, 'danger')
    }
  }
}
</script>

<style scoped lang="scss">
/* Estilo de botones de tabla */
button.btn.btn-link.btn-m {
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
  color: $blue;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

/* Estilo de avatares */
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-fallback {
  font-size: 1.5rem;
  color: #6c757d;
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}

.container {
  width: 100%;
  padding: 0;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.form-check-input {
  cursor: pointer;
}

/* Estilos del modal */
.user-profile-form {
  padding: 18px 10px;
  border-radius: 8px;
  margin: 0 auto;
  width: 100%;
}

.user-profile-form small {
  color: var(--bs-gray-500);
}

.user-profile-form .form-control:disabled,
.user-profile-form .form-select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

/* Estilos del avatar en el modal */
.avatar-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid #dee2e6;
}

.avatar-preview-fallback {
  display: inline-block;
}

.avatar-preview-fallback i {
  font-size: 120px;
  color: #6c757d;
}

@media (max-width: 768px) {
  thead {
    display: none;
  }

  .container {
    width: 100%;
    padding: 0;
  }

  table {
    display: block;
    width: 100%;
  }

  tr {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    border-bottom: 1px solid #dee2e6;
  }

  td:last-child {
    border-bottom: none;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #6c757d;
    flex-basis: 40%;
  }

  td span,
  td div {
    flex-grow: 1;
    text-align: right;
  }

  tbody {
    display: block;
    width: 100%;
  }

  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .user-profile-form .row {
    flex-direction: column;
  }

  .user-profile-form .col-md-4 {
    margin-bottom: 10px;
  }

  .contract-col {
    width: 150px;
  }

  .hours-col {
    width: 100px;
  }
}
</style>
