export const PROJECT_STATES = [
  {
    key: 'Draft',
    isInitialState: true,
    displayName: 'Borrador',
    color: 'gray-600',
    icon: 'bi bi-clock'
  },
  {
    key: 'Active',
    isInitialState: true,
    displayName: 'Activo',
    color: 'success',
    icon: 'circle-fill'
  },
  {
    key: 'Finished',
    displayName: 'Finalizado',
    color: 'gray-400',
    icon: 'check2-all'
  },
  {
    key: 'Canceled',
    displayName: 'Cancelado',
    color: 'danger',
    icon: 'x-circle'
  }
]
