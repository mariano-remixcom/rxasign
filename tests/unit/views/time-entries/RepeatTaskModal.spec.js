import RepeatTaskModal from '@/views/time-entries/RepeatTaskModal.vue'
import { shallowMount } from '@vue/test-utils'

describe('RepeatTaskModal.vue', () => {
  // TODO: Remove this
  // eslint-disable-next-line no-unused-vars
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RepeatTaskModal, {
      props: {
        task: {
          id: 1,
          type: 'Daily',
          description: 'Implement feature X'
        }
      }
    })
  })

  it('should show task type and description', () => {
    const type = wrapper.find('#task-type')
    const description = wrapper.find('#task-description')

    expect(type.text()).toBe('Daily')
    expect(description.text()).toBe('Implement feature X')
  })

  it('should have fields from, to, and checkboxes for every day of the week', () => {
    const fromDate = wrapper.find('#from-date')
    const toDate = wrapper.find('#to-date')
    const checkboxes = wrapper.findAll('.day-checkbox')

    expect(fromDate.exists()).toBe(true)
    expect(toDate.exists()).toBe(true)
    expect(checkboxes.length).toBe(5)
  })

  it('should set from date to 5 days before by default', () => {
  }

  it('should set to date to today by default')

  it('should emit close event when clicking close button')
  it('should emit close event when clicking cancel button')
  it('should emit save event with correct payload when clicking save button')
})
