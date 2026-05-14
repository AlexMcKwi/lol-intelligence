import { riotFetch } from '@/lib/riot/client'

// Mock fetch globally
global.fetch = jest.fn()

describe('riotFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch from the correct Riot API endpoint', async () => {
    const mockResponse = { status: { name: 'EU West' } }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    await riotFetch('/lol/status/v4/platform-data')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://europe.api.riotgames.com/lol/status/v4/platform-data',
      expect.objectContaining({
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
        cache: 'no-store',
      })
    )
  })

  it('should return parsed JSON response on success', async () => {
    const mockResponse = { id: 'match-123', gameDuration: 1800 }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await riotFetch('/lol/match/v5/matches/match-123')

    expect(result).toEqual(mockResponse)
  })

  it('should throw error when response is not ok', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(riotFetch('/lol/invalid/endpoint')).rejects.toThrow('Riot API Error')
  })

  it('should throw error on 401 Unauthorized', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    })

    await expect(riotFetch('/lol/match/v5/matches')).rejects.toThrow('Riot API Error')
  })

  it('should throw error on 429 Rate Limited', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
    })

    await expect(riotFetch('/lol/match/v5/matches')).rejects.toThrow('Riot API Error')
  })

  it('should throw error on 500 Server Error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(riotFetch('/lol/match/v5/matches')).rejects.toThrow('Riot API Error')
  })

  it('should set cache: no-store header', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    await riotFetch('/lol/status/v4/platform-data')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        cache: 'no-store',
      })
    )
  })

  it('should include Riot API key from environment', async () => {
    const originalKey = process.env.RIOT_API_KEY
    process.env.RIOT_API_KEY = 'test-api-key-12345'

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    await riotFetch('/lol/match/v5/matches')

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'X-Riot-Token': 'test-api-key-12345',
        },
      })
    )

    process.env.RIOT_API_KEY = originalKey
  })

  it('should handle different API endpoints', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    const endpoints = [
      '/lol/match/v5/matches/match-123',
      '/lol/summoner/v4/summoners/by-name/username',
      '/lol/league/v4/entries/by-summoner/summoner-id',
      '/lol/status/v4/platform-data',
    ]

    for (const endpoint of endpoints) {
      jest.clearAllMocks()
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await riotFetch(endpoint)

      expect(global.fetch).toHaveBeenCalledWith(
        `https://europe.api.riotgames.com${endpoint}`,
        expect.any(Object)
      )
    }
  })

  it('should handle complex JSON responses', async () => {
    const complexResponse = {
      matches: [
        { id: '1', duration: 1800, result: 'win' },
        { id: '2', duration: 2100, result: 'loss' },
      ],
      metadata: {
        total: 2,
        timestamp: Date.now(),
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => complexResponse,
    })

    const result = await riotFetch('/lol/match/v5/matches/by-puuid/puuid-123/ids')

    expect(result).toEqual(complexResponse)
  })
})
