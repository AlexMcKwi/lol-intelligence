import { GET } from '@/app/api/test/route'

// Mock global fetch
global.fetch = jest.fn()

describe('GET /api/test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch from Riot status API', async () => {
    const mockData = {
      id: 'eu1',
      name: 'EU West',
      locales: ['en_US'],
      maintenances: [],
      incidents: [],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const response = await GET()
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://europe.api.riotgames.com/lol/status/v4/platform-data',
      expect.objectContaining({
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      })
    )

    expect(data).toEqual(mockData)
  })

  it('should use correct API endpoint', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    })

    await GET()

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[0]).toBe('https://europe.api.riotgames.com/lol/status/v4/platform-data')
  })

  it('should include Riot API key header', async () => {
    const originalKey = process.env.RIOT_API_KEY
    process.env.RIOT_API_KEY = 'test-api-key-xyz'

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    })

    await GET()

    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    const headers = callArgs[1].headers

    expect(headers['X-Riot-Token']).toBe('test-api-key-xyz')

    process.env.RIOT_API_KEY = originalKey
  })

  it('should return JSON response', async () => {
    const mockData = {
      id: 'eu1',
      name: 'EU West',
      maintenances: [
        {
          id: 'maintenance-1',
          status: 'scheduled',
          updates: [],
          created_at: '2024-01-01T00:00:00Z',
          maintenance_time: '2024-01-02T00:00:00Z',
          riot_status: 'in-progress',
          platforms: ['windows', 'macos'],
        },
      ],
      incidents: [],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const response = await GET()
    const data = await response.json()

    expect(data).toEqual(mockData)
  })

  it('should handle API response with incidents', async () => {
    const mockData = {
      id: 'eu1',
      name: 'EU West',
      maintenances: [],
      incidents: [
        {
          id: 'incident-1',
          status: 'ongoing',
          created_at: '2024-01-01T00:00:00Z',
          updates: [
            {
              id: 'update-1',
              status: 'update',
              content: 'Server issue detected',
              created_at: '2024-01-01T00:00:00Z',
              platforms: ['windows'],
            },
          ],
          platforms: ['windows', 'macos'],
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const response = await GET()
    const data = await response.json()

    expect(data.incidents).toHaveLength(1)
    expect(data.incidents[0].status).toBe('ongoing')
  })

  it('should handle empty status response', async () => {
    const mockData = {
      id: 'eu1',
      name: 'EU West',
      maintenances: [],
      incidents: [],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const response = await GET()
    const data = await response.json()

    expect(data.maintenances).toEqual([])
    expect(data.incidents).toEqual([])
  })

  it('should return Response object', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({}),
    })

    const response = await GET()

    expect(response).toBeInstanceOf(Response)
  })

  it('should handle fetch errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    await expect(GET()).rejects.toThrow('Network error')
  })

  it('should handle malformed JSON response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => {
        throw new Error('Invalid JSON')
      },
    })

    await expect(GET()).rejects.toThrow('Invalid JSON')
  })

  it('should preserve data structure from API', async () => {
    const complexData = {
      id: 'eu1',
      name: 'EU West',
      locales: ['en_US', 'fr_FR', 'de_DE'],
      maintenances: [
        {
          id: 'maint-1',
          status: 'scheduled',
          title: 'Server Maintenance',
          description: 'Scheduled maintenance',
          updates: [],
          created_at: '2024-01-01T00:00:00Z',
          maintenance_time: '2024-01-02T02:00:00Z',
          rfc_updates: null,
          riot_status: 'in-progress',
          platforms: ['windows', 'macos', 'linux'],
        },
      ],
      incidents: [
        {
          id: 'inc-1',
          status: 'ongoing',
          created_at: '2024-01-01T12:00:00Z',
          updates: [
            {
              id: 'upd-1',
              status: 'investigating',
              content: 'Issue under investigation',
              author: 'Riot',
              created_at: '2024-01-01T12:00:00Z',
              platforms: ['windows'],
            },
          ],
          platforms: ['windows'],
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => complexData,
    })

    const response = await GET()
    const data = await response.json()

    expect(data).toEqual(complexData)
    expect(data.maintenances[0].platforms).toContain('windows')
    expect(data.incidents[0].status).toBe('ongoing')
  })
})
