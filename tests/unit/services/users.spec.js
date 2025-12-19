import UsersService from '@/services/users'
import api from '@/services/api'

describe('UsersService', () => {
  const service = new UsersService()

  beforeEach(() => {
    api().get = vi.fn()
    api().patch = vi.fn()
    api().post = vi.fn()
  })

  it('should fetch from "/users/with-hours" when calling getAllUsersWithHoursData', async () => {
    await service.getAllUsersWithHoursData()
    expect(api().get).toHaveBeenCalledWith('/users/with-hours')
  })

  it('should fetch from "/users/minimal-active" when calling getActiveResourcesForCombobox', async () => {
    await service.getActiveResourcesForCombobox()
    expect(api().get).toHaveBeenCalledWith('/users/minimal-active')
  })

  it('should fetch from "/users/available-hours/[id]" when calling getAvailableHoursForUser', async () => {
    const userId = 1

    await service.getAvailableHoursForUser(userId)
    expect(api().get).toHaveBeenCalledWith(`/users/available-hours/${userId}`)
  })

  it('should fetch from "/users/assigned-hours/[id]" when calling getAssignedHoursForUser', async () => {
    const userId = 2

    await service.getAssignedHoursForUser(userId)
    expect(api().get).toHaveBeenCalledWith(`/users/assigned-hours/${userId}`)
  })

  it('should fetch from "/users/[id]" when calling getUserById', async () => {
    const userId = 3

    await service.getUserById(userId)
    expect(api().get).toHaveBeenCalledWith(`/users/${userId}`)
  })

  it('should fetch from "/users" when calling getAllUsers', async () => {
    await service.getAllUsers()
    expect(api().get).toHaveBeenCalledWith('/users')
  })

  it('should fetch from "/users/user-with-resources/[id]" when calling getUserWithResources', async () => {
    const userId = 4

    await service.getUserWithResources(userId)
    expect(api().get).toHaveBeenCalledWith(`/users/user-with-resources/${userId}`)
  })

  it('should patch to "/users/[id]" when calling updateUser', async () => {
    const userId = 5
    const data = { name: 'Updated User' }

    await service.updateUser(userId, data)
    expect(api().patch).toHaveBeenCalledWith(`/users/${userId}`, data)
  })

  it('should post to "users/create" when calling createUser', async () => {
    api().post = vi.fn()
    const userData = { name: 'New User' }

    await service.createUser(userData)
    expect(api().post).toHaveBeenCalledWith('users/create', userData)
  })
})
