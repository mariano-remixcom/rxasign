import RepeatTaskModal from '@/views/time-entries/RepeatTaskModal.vue'
import { shallowMount } from '@vue/test-utils'

describe('RepeatTaskModal.vue', () => {
  // TODO: Remove this
  // eslint-disable-next-line no-unused-vars
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RepeatTaskModal)
  })

  it('should show task type and description')
  it('should have fields from, to, and checkboxes for every day of the week')

  it('should set from date to 7 days before by default')
  it('should set to date to today by default')

  it('should emit close event when clicking close button')
  it('should emit close event when clicking cancel button')
  it('should emit save event with correct payload when clicking save button')
})
