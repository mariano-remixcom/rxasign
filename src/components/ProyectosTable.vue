<template>
  <div class="container wmt-4">
    <table class="table">
      <thead class="table-light">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Cliente</th>
          <th scope="col">Integrantes</th>
          <th scope="col">Contrato</th>
          <th scope="col">Asignadas</th>
          <th scope="col">Modificado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody class="table-group-divider align-middle">
        <tr v-for="(item, index) in tableData" :key="index">
          <td>
            <a class="link-secondary pointer" @click="goToVerProyecto(index)">{{ item.nombre }}</a>
          </td>
          <td>{{ item.cliente }}</td>
          <td>
            <div class="avatars">
              <template v-for="(nombre, idx) in item.nombres" :key="idx">
                <i class="bi bi-person-circle avatar-fallback" :title="nombre"></i>
              </template>
            </div>
          </td>
          <td>{{ item.contrato }}</td>
          <td>{{ item.asignadas }}</td>
          <td>{{ item.modificado }}</td>
          <td>
            <button class="btn btn-link btn-m"><i class="bi bi-clipboard-data"></i></button>
            <button class="btn btn-link btn-m" @click="finishProject"><i class="bi bi-check-circle"></i></button>
            <button class="btn btn-link btn-m" @click="editProject"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-link btn-m" @click="deleteProject"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Modal
    :is-visible="showModal"
    :title="title"
    :large="large"
    :is-editing="isEditing"
    @close="
      () => {
        ;(showModal = false), (isDeleting = false), (isEnding = false), (isEditing = false), (large = false)
      }
    "
    @save="saveChanges"
  >
    <Eliminar v-if="isDeleting" :ente="ente" />
    <Finalizar v-if="isEnding" :ente="ente" />
    <div v-if="isEditing" class="modal-body-content">
      <ProjectAddForm />
    </div>
  </Modal>
</template>

<script>
import Eliminar from '@/components/EliminarModal.vue'
import Finalizar from '@/components/FinalizarModal.vue'
import Modal from '@/layouts/default/ModalModal.vue'
import ProjectAddForm from '@/components/ProjectAddForm.vue'

export default {
  name: 'ProyectosTable',
  components: {
    Modal,
    Eliminar,
    Finalizar,
    ProjectAddForm
  },
  data() {
    return {
      tableData: [
        {
          nombre: 'Recaudaciones',
          cliente: 'Bancor',
          nombres: ['Rodrigo Loza', 'Agustin Menegat', 'Joaquin Zanardi', 'Matias Berthelot'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        },
        {
          nombre: 'Odoo dev',
          cliente: 'Hoklan',
          nombres: ['Rodrigo Loza', 'Yanina Silva', 'Mariano Soulé', 'Joaquin Zanardi', 'Yoana Gerling', 'Patricio Sabatini'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        },
        {
          nombre: 'Desarrollo App',
          cliente: 'Checkpet',
          nombres: ['Agustin Menegat', 'Yanina Silva', 'Yoana Gerling'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        },
        {
          nombre: 'Discovery',
          cliente: 'FUDU',
          nombres: ['Yanina Silva', 'Patricio Sabatini'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        },
        {
          nombre: 'Asignaciones',
          cliente: 'Remix',
          nombres: ['Maurizio Volpe', 'Joaquin Zanardi', 'Yoana Gerling', 'Patricio Sabatini'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        },
        {
          nombre: 'Redes',
          cliente: 'Remix',
          nombres: ['Yanina Silva', 'Mariano Soulé', 'Patricio Sabatini'],
          contrato: '160 hs',
          asignadas: '140 hs',
          modificado: '2023-07-01'
        }
      ],
      showModal: false,
      isDeleting: false,
      isEnding: false,
      title: '',
      ente: '',
      isEditing: false,
      large: false
    }
  },
  mounted() {
    // this.initTooltips();
  },
  updated() {
    // this.initTooltips();
  },
  methods: {
    deleteProject() {
      this.showModal = true
      this.isDeleting = true
      this.title = 'Eliminar proyecto'
      this.ente = 'proyecto'
    },
    finishProject() {
      this.showModal = true
      this.isEnding = true
      this.title = 'Finalizar proyecto'
      this.ente = 'proyecto'
    },
    editProject() {
      this.$router.push('/proyectos/editar')
    },
    goToVerProyecto(id) {
      this.$router.push({ name: 'VerProyecto', params: { id } })
    }

    // initTooltips() {
    //   const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    //   tooltipTriggerList.map(function (tooltipTriggerEl) {
    //     return new bootstrap.Tooltip(tooltipTriggerEl);
    //   });
    // }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
/* fix botones de tabla */
button.btn.btn-link.btn-m {
  --bs-btn-padding-x: 0.2rem;
  --bs-btn-padding-y: 0;
}

/* avatares */
.avatars {
  display: flex;
}

.avatar,
.avatar-fallback {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0px;
  /* Espacio entre avatares */
}

.avatar:last-child,
.avatar-fallback:last-child {
  margin-right: 0;
  /* Eliminar margen derecho del último avatar */
}
</style>
