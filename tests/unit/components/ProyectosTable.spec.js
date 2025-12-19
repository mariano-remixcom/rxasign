import ProyectosTable from '@/components/ProyectosTable.vue'
import { flushPromises, shallowMount } from '@vue/test-utils'

const PROJECTS = [
  {
    id: 1,
    name: 'Project A',
    client: { name: 'Client A' },
    squad: { resources: [], _count: { resources: 0 } },
    monthlyContractedHours: 180,
    totalAsignedHours: 0,
    updatedAt: new Date(),
    currentState: { currentState: 'ACTIVE' }
  },
  {
    id: 2,
    name: 'Project B',
    client: { name: 'Client B' },
    squad: { resources: [], _count: { resources: 0 } },
    monthlyContractedHours: 180,
    totalAsignedHours: 0,
    updatedAt: new Date(),
    currentState: { currentState: 'ACTIVE' }
  }
]

describe('ProyectosTable.vue', () => {
  let wrapper
  let ProjectsMock

  beforeEach(() => {
    ProjectsMock = vi.fn(
      class {
        getAllProjects = vi.fn().mockReturnValue(
          Promise.resolve({
            data: PROJECTS
          })
        )
      }
    )

    vi.mock('@/composables/session/useSetupSession', () => ({
      useSetupSession: vi.fn().mockReturnValue({
        session: {},
        isAdminUser: false,
        userFirstName: 'Test',
        userFullName: 'Test Test'
      })
    }))
  })

  it('renders projects list when fetched', async () => {
    wrapper = shallowMount(ProyectosTable, {
      data() {
        return { projectsService: new ProjectsMock() }
      }
    })

    await flushPromises()

    expect(wrapper.find('#row1').exists()).toBe(true)
    expect(wrapper.find('#row2').exists()).toBe(true)
  })

  it('renders empty message when no projects', async () => {
    const ProjectsEmptyMock = vi.fn(
      class {
        getAllProjects = vi.fn().mockReturnValue(
          Promise.resolve({
            data: []
          })
        )
      }
    )

    wrapper = shallowMount(ProyectosTable, {
      data() {
        return { projectsService: new ProjectsEmptyMock() }
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Aún no hay proyectos cargados')
  })
})
