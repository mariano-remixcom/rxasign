import ReadRow from '@/views/time-entries/ReadRow.vue'
import { shallowMount } from '@vue/test-utils'

describe('RegistroHoras.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ReadRow, {
      props: {
        projectName: '',
        entry: {}
      }
    })
  })

  it('Verificar si repeat task button existe', () => {
    expect(wrapper.find('#repeat-task').exists()).toBe(true)
  })

  it('Verificar si repeat task tiene el icono correspondiente', () => {
    const button = wrapper.find('#repeat-task')
    const icon = button.find('i.bi-clock')

    expect(icon.exists()).toBe(true)
  })

  it('Verificar si emite el evento repeatTask al hacer click en el boton', async () => {
    const button = wrapper.find('#repeat-task')

    await button.trigger('click')
    expect(wrapper.emitted()['repeat-task']).toBeTruthy()
  })
})
