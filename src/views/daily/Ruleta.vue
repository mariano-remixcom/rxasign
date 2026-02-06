<template>
  <div class="ruleta-container">
    <div class="main-layout">
      <div class="left-column">
        <div class="controls-card">
          <div class="date-section">
            <label class="section-label">Fecha:</label>
            <div>{{ formatDate(selectedDate) }}</div>
          </div>
          <div v-if="lastLeader" class="last-leader-section">
            <div class="section-label">Último líder:</div>
            <div class="leader-name">{{ lastLeader }}</div>
            <div class="leader-date">{{ formatDate(lastLeaderDate) }}</div>
            <div class="leader-note">(No participará hoy)</div>
          </div>
          <div class="participants-section">
            <label class="section-label">Participantes:</label>
            <div class="participants-grid">
              <div v-for="user in availableUsers" :key="user.id" class="form-check">
                <input
                  :id="`participant-${user.id}`"
                  v-model="selectedParticipants"
                  class="form-check-input"
                  type="checkbox"
                  :value="user.id"
                />
                <label class="form-check-label" :for="`participant-${user.id}`">
                  {{ user.firstName }}
                </label>
              </div>
            </div>
            <small v-if="selectedParticipants.length === 0" class="text-danger d-block mt-2">
              Debes seleccionar al menos un participante
            </small>
          </div>
        </div>
      </div>
      <div class="center-column">
        <div class="header-section">
          <h3 class="main-title">Ruleta</h3>
          <p class="subtitle">¡Gira la ruleta para seleccionar al líder del día!</p>
        </div>
        <div v-if="participatingUsers.length > 0" class="wheel-container">
          <div class="wheel-wrapper">
            <div class="wheel-pointer"></div>
            <svg
              ref="wheelSvg"
              class="wheel-svg"
              :class="{ spinning: isSpinning }"
              :style="{ transform: `rotate(${rotation}deg)` }"
              viewBox="0 0 500 500"
              width="500"
              height="500"
            >
              <g v-for="(user, index) in participatingUsers" :key="user.id">
                <path :d="getSegmentPath(index)" :fill="getColor(index)" :stroke="'#ffffff'" :stroke-width="3" />
                <text
                  :transform="getTextTransform(index)"
                  :fill="getTextColor(index)"
                  font-size="18"
                  font-weight="700"
                  text-anchor="middle"
                >
                  {{ user.firstName }}
                </text>
              </g>
              <circle cx="250" cy="250" r="40" fill="#7749f8" stroke="#ffffff" stroke-width="4" />
              <text x="250" y="262" text-anchor="middle" fill="#ffffff" font-size="28" font-weight="bold">🎯</text>
            </svg>
          </div>
        </div>

        <div v-else-if="availableUsers.length > 0" class="alert alert-info">
          Selecciona los participantes para mostrar la ruleta
        </div>

        <div v-else class="alert alert-warning">No hay usuarios disponibles para la ruleta</div>
        <div class="spin-button-container">
          <button class="btn btn-primary btn-lg" :disabled="isSpinning || participatingUsers.length === 0" @click="spinWheel">
            <span v-if="isSpinning">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Girando...
            </span>
            <span v-else>
              <i class="bi bi-play-circle me-2"></i>
              Girar Ruleta
            </span>
          </button>
        </div>
      </div>
      <div class="right-column"></div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">🎉 ¡Líder del día seleccionado!</h5>
          <button type="button" class="btn-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body text-center">
          <div class="winner-circle mb-3">
            <img src="@/assets/ganador.png" alt="Ganaste pero te toca la daily" class="winner-image" />
          </div>
          <h3 class="winner-name mb-3">{{ selectedLeaderName }}</h3>
          <p class="leader-date">Fuiste seleccionado como líder del Daily Report</p>
          <p class="leader-date">Fecha: {{ formattedDate }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<script>
import DailyReportService from '@/services/daily-report'
import UsersService from '@/services/users'

export default {
  name: 'RuletaLeader',

  data() {
    return {
      usersService: new UsersService(),
      dailyReportService: new DailyReportService(),
      dailyUsers: [],
      selectedParticipants: [],
      selectedLeaderId: null,
      selectedLeaderName: '',
      lastLeaderId: null,
      lastLeader: '',
      lastLeaderDate: null,
      selectedDate: this.getTodayDate(),
      isLoading: false,
      isSpinning: false,
      showModal: false,
      rotation: 0,
      colors: ['#7749f8', '#9b7df5', '#5227cc', '#ebe5fc', '#b89ef7', '#6435d9']
    }
  },

  computed: {
    availableUsers() {
      return this.dailyUsers.filter((user) => user.id !== this.lastLeaderId)
    },

    participatingUsers() {
      return this.availableUsers.filter((user) => this.selectedParticipants.includes(user.id))
    },

    segmentAngle() {
      return this.participatingUsers.length > 0 ? 360 / this.participatingUsers.length : 0
    },

    formattedDate() {
      const date = new Date(this.selectedDate + 'T00:00:00')

      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  mounted() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const usersResponse = await this.usersService.getDailyUsers()

        this.dailyUsers = usersResponse.data || []

        await this.loadLastLeader()

        this.selectedParticipants = this.availableUsers.map((user) => user.id)
      } catch (error) {
        console.error('Error cargando datos:', error)
        this.showErrorNotification('Error al cargar los usuarios')
      } finally {
        this.isLoading = false
      }
    },

    async loadLastLeader() {
      try {
        const response = await this.dailyReportService.getLastLeader()

        if (response.data) {
          this.lastLeaderId = response.data.id
          this.lastLeader = `${response.data.firstName} ${response.data.lastName}`
          this.lastLeaderDate = response.data.date
        }
      } catch (error) {
        console.log('No hay líder previo')
      }
    },

    spinWheel() {
      if (this.isSpinning || this.participatingUsers.length === 0) return

      this.isSpinning = true

      const winnerIndex = Math.floor(Math.random() * this.participatingUsers.length)

      const spins = 5
      const extraRotation = 360 * spins

      const segmentStartAngle = -90 + winnerIndex * this.segmentAngle
      const segmentCenterAngle = segmentStartAngle + this.segmentAngle / 2

      const targetRotation = extraRotation - segmentCenterAngle - 90

      this.rotation += targetRotation

      setTimeout(() => {
        this.isSpinning = false
        this.showWinner(winnerIndex)
      }, 4000)
    },

    async showWinner(index) {
      const winner = this.participatingUsers[index]

      if (winner) {
        this.selectedLeaderId = winner.id
        this.selectedLeaderName = `${winner.firstName} ${winner.lastName}`

        await this.saveLeaderToBackend()

        this.showModal = true
      }
    },

    async saveLeaderToBackend() {
      try {
        await this.dailyReportService.setDailyLeader({
          date: this.selectedDate,
          leaderId: this.selectedLeaderId
        })
      } catch (error) {
        console.error('Error guardando líder:', error)
        this.showErrorNotification('Error al guardar el líder del día')
      }
    },

    getSegmentPath(index) {
      const centerX = 250
      const centerY = 250
      const radius = 230
      const startAngle = index * this.segmentAngle
      const endAngle = startAngle + this.segmentAngle

      const startRad = ((startAngle - 90) * Math.PI) / 180
      const endRad = ((endAngle - 90) * Math.PI) / 180

      const x1 = centerX + radius * Math.cos(startRad)
      const y1 = centerY + radius * Math.sin(startRad)
      const x2 = centerX + radius * Math.cos(endRad)
      const y2 = centerY + radius * Math.sin(endRad)

      const largeArc = this.segmentAngle > 180 ? 1 : 0

      return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    },

    getTextTransform(index) {
      const centerX = 250
      const centerY = 250
      const radius = 160
      const angle = index * this.segmentAngle + this.segmentAngle / 2

      const angleRad = ((angle - 90) * Math.PI) / 180
      const x = centerX + radius * Math.cos(angleRad)
      const y = centerY + radius * Math.sin(angleRad)

      return `translate(${x}, ${y}) rotate(${angle})`
    },

    getColor(index) {
      return this.colors[index % this.colors.length]
    },

    getTextColor(index) {
      const bgColor = this.colors[index % this.colors.length]

      return bgColor === '#ebe5fc' ? '#2d1b69' : '#ffffff'
    },

    closeModal() {
      this.showModal = false
    },

    getTodayDate() {
      const today = new Date()

      return today.toISOString().split('T')[0]
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)

      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    showErrorNotification(message) {
      alert(message)
    }
  }
}
</script>

<style scoped lang="scss">
$primary: #7749f8;
$primary-dark: #5227cc;
$primary-light: #ebe5fc;
$gray-100: #f8f9fa;
$gray-800: #343a40;
$white: #fff;
$font-weight-semibold: 600;

.ruleta-container {
  min-height: 100vh;
  background-color: $gray-100;
  padding: 0;
}

.main-layout {
  display: grid;
  grid-template-columns: 400px 2fr 1fr;
  min-height: 100vh;
  gap: 0;

  @media (max-width: 1200px) {
    grid-template-columns: 400px 2fr 0.5fr;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.left-column {
  width: 400px;
  background-color: $gray-100;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 2rem 1rem;
  }
}

.right-column {
  background-color: $gray-100;

  @media (max-width: 1024px) {
    display: none;
  }
}

.center-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem 2rem 3rem;
  background-color: $white;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 2rem 1rem;
    justify-content: center;
  }
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  margin-top: 1rem;
  width: 100%;

  .main-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: $gray-800;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  .subtitle {
    font-size: 1.2rem;
    color: #6c757d;
    margin: 0;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
}

.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 1.5rem;
  width: 100%;
}

.wheel-wrapper {
  position: relative;
  display: inline-block;
}

.wheel-pointer {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-top: 35px solid $primary;
  z-index: 10;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
}

.wheel-svg {
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2));

  &.spinning {
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  }

  @media (max-width: 768px) {
    width: 350px !important;
    height: 350px !important;
  }
}

.spin-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.controls-card {
  background: $white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.last-leader-section {
  background-color: $primary-light;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;

  .section-label {
    font-size: 1.1rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .leader-name {
    color: $primary;
    font-weight: 700;
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }

  .leader-date {
    color: $gray-800;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .leader-note {
    color: #6c757d;
    font-size: 0.9rem;
    font-style: italic;
  }
}

.date-section {
  margin-bottom: 1.5rem;
  text-align: center;

  .section-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: $gray-800;
    margin-bottom: 0.5rem;
  }

  div {
    font-size: 1rem;
    color: $gray-800;
  }
}

.participants-section {
  .section-label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: $gray-800;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  .participants-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: center;

    .form-check {
      margin: 0;
      width: 100%;
      max-width: 220px;
      padding-left: 2rem;
    }

    .form-check-label {
      font-size: 0.95rem;
      cursor: pointer;
      font-weight: 500;
    }
  }
}

.form-check-input {
  &:checked {
    background-color: $primary;
    border-color: $primary;
  }

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }
}

.btn-primary {
  background-color: $primary;
  border-color: $primary;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 1.1rem;

  &:hover:not(:disabled) {
    background-color: $primary-dark;
    border-color: $primary-dark;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.alert {
  max-width: 400px;
  margin: 2rem auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: $white;
  border-radius: 12px;
  max-width: 700px;
  width: 95%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .modal-title {
    margin: 0;
    font-weight: 600;
    color: $gray-800;
  }

  .btn-close {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.5;
    line-height: 1;

    &:hover {
      opacity: 1;
    }
  }
}

.modal-body {
  padding: 2.5rem;
}

.winner-circle {
  display: flex;
  justify-content: center;
}

.winner-name {
  color: $primary;
  font-weight: 700;
  font-size: 1.8rem;
}

.winner-image {
  width: 500px;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
  animation: popIn 0.4s ease;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
