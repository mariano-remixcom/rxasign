import TimeEntriesService from '@/services/time-entries'
import api from '@/services/api'

describe('TimeEntriesService', () => {
  const service = new TimeEntriesService()

  beforeEach(() => {
    api().get = vi.fn()
    api().post = vi.fn()
    api().put = vi.fn()
    api().delete = vi.fn()
  })

  it('should post to "/time-entries" when calling createTimeEntry', async () => {
    const timeEntryData = { hours: 8, date: '2025-12-19' }

    await service.createTimeEntry(timeEntryData)
    expect(api().post).toHaveBeenCalledWith('/time-entries', timeEntryData)
  })

  it('should fetch from "/time-entries/me" when calling getMyTimeEntries', async () => {
    await service.getMyTimeEntries()
    expect(api().get).toHaveBeenCalledWith('/time-entries/me')
  })

  it('should fetch from "/time-entries/date/[date]" when calling getTimeEntriesByDate', async () => {
    const date = '2025-12-19'

    await service.getTimeEntriesByDate(date)
    expect(api().get).toHaveBeenCalledWith(`/time-entries/date/${date}`)
  })

  it('should fetch from "/time-entries/project/[projectId]" when calling getTimeEntriesByProject', async () => {
    const projectId = 1

    await service.getTimeEntriesByProject(projectId)
    expect(api().get).toHaveBeenCalledWith(`/time-entries/project/${projectId}`)
  })

  it('should fetch from "/time-entries/week/[startDate]" when calling asyncgetTimeEntriesByWeek', async () => {
    const startDate = '2025-12-15'

    await service.asyncgetTimeEntriesByWeek(startDate)
    expect(api().get).toHaveBeenCalledWith(`/time-entries/week/${startDate}`)
  })

  it('should put to "/time-entries/[id]" when calling updateTimeEntry', async () => {
    const id = 1
    const data = { hours: 6 }

    await service.updateTimeEntry(id, data)
    expect(api().put).toHaveBeenCalledWith(`/time-entries/${id}`, data)
  })

  it('should delete from "/time-entries/[id]" when calling deleteTimeEntry', async () => {
    const id = 2

    await service.deleteTimeEntry(id)
    expect(api().delete).toHaveBeenCalledWith(`/time-entries/${id}`)
  })

  it('should fetch from "/time-entries/sumary" with params when calling getSumaryHoursByUser', async () => {
    const startDate = '2025-12-01'
    const endDate = '2025-12-31'
    const projectIds = [1, 2, 3]

    await service.getSumaryHoursByUser(startDate, endDate, projectIds)
    expect(api().get).toHaveBeenCalledWith('/time-entries/sumary', {
      params: {
        startDate,
        endDate,
        projectIds
      }
    })
  })

  it('should fetch from "/time-entries/" with params when calling getUserDetail', async () => {
    const userId = 1
    const startDate = '2025-12-01'
    const endDate = '2025-12-31'
    const projectIds = [1, 2]

    await service.getUserDetail(userId, startDate, endDate, projectIds)
    expect(api().get).toHaveBeenCalledWith('/time-entries/', {
      params: {
        userId,
        startDate,
        endDate,
        projectIds
      }
    })
  })

  it('should post to "/time-entries/export" with responseType blob when calling exportRegisteredHours', async () => {
    const startDate = '2025-12-01'
    const endDate = '2025-12-31'
    const selectedProjectId = 1
    const selectedUsers = [1, 2]
    const format = 'xlsx'

    await service.exportRegisteredHours(startDate, endDate, selectedProjectId, selectedUsers, format)
    expect(api().post).toHaveBeenCalledWith(
      '/time-entries/export',
      {
        startDate,
        endDate,
        selectedProjectId,
        selectedUsers,
        format
      },
      {
        responseType: 'blob'
      }
    )
  })
})
