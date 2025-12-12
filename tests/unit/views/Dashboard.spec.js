import Dashboard from '@/views/Dashboard.vue'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSetupSession } from '@/composables/session/useSetupSession'

vi.mock('@/composables/session/useSetupSession', () => ({
  useSetupSession: vi.fn()
}))

describe('Dashboard.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders projects, users and hour tracking cards if user is type admin', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {})

    expect(wrapper.find('#projects-card').exists()).toBe(true)
    expect(wrapper.find('#hour-tracking-card').exists()).toBe(true)
    expect(wrapper.find('#users-card').exists()).toBe(true)
  })

  it('renders project add button if user is type admin', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {})

    expect(wrapper.find('#add-project-button').exists()).toBe(true)
  })

  it('renders projects card if user is type user', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: false,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {})

    expect(wrapper.find('#projects-card').exists()).toBe(true)
    expect(wrapper.find('#hour-tracking-card').exists()).toBe(false)
    expect(wrapper.find('#users-card').exists()).toBe(false)
  })

  it('goes to projects page when click on open projects button', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })

    const openProjectButton = wrapper.findComponent('#open-project-button')

    expect(openProjectButton.props().to).toBe('/proyectos')
  })

  it('goes to projects add page when click on add project button', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })

    const addProjectButton = wrapper.findComponent('#add-project-button')

    expect(addProjectButton.props().to).toBe('/proyectos/agregar')
  })

  it('goes to users page when click on open users button', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })

    const openUserButton = wrapper.findComponent('#open-user-button')

    expect(openUserButton.props().to).toBe('/usuarios')
  })

  it('goes to users add page when click on add users button', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })

    const addUserButton = wrapper.findComponent('#add-user-button')

    expect(addUserButton.props().to).toBe('/agregar')
  })

  it('goes to hour tracking page when click on open hour tracking button', () => {
    useSetupSession.mockReturnValue({
      session: {},
      isAdminUser: true,
      userFirstName: 'Test',
      userFullName: 'Test Test'
    })

    const wrapper = shallowMount(Dashboard, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })

    const openHourTrackingButton = wrapper.findComponent('#open-hour-tracking-button')

    expect(openHourTrackingButton.props().to).toBe('/horas')
  })
})
