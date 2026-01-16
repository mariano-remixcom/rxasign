import ReadRow from '@/views/time-entries/ReadRow.vue'
import Row from '@/views/time-entries/Row.vue'
import { shallowMount } from '@vue/test-utils'

describe('Row.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Row, {
      props: {
        entry: {
          id: 1,
          description: 'prueba'
        },
        projects: []
      }
    })
  })

  it('should reemit "repeat-task" event when repeat task button is clicked', async () => {
    const ReadRowComponent = wrapper.findComponent(ReadRow)

    ReadRowComponent.vm.$emit('repeat-task')

    const repeatTaskEvent = wrapper.emitted('repeat-task')[0][0]

    expect(repeatTaskEvent.id).toBe(1)
    expect(repeatTaskEvent.description).toBe('prueba')
  })
})
