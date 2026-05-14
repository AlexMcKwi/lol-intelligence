import { POST } from '@/app/api/sync/route'
import { prisma } from '@/lib/prisma'
import { getMatchIds, getMatch } from '@/lib/riot/matches'
import { parseParticipant } from '@/lib/riot/parser'

// Mock the dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: {
      upsert: jest.fn(),
    },
    matchParticipant: {
      create: jest.fn(),
    },
  },
}))

jest.mock('@/lib/riot/matches', () => ({
  getMatchIds: jest.fn(),
  getMatch: jest.fn(),
}))

jest.mock('@/lib/riot/parser', () => ({
  parseParticipant: jest.fn(),
}))

describe('POST /api/sync', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createRequestBody = (puuid: string, summonerId: string) => {
    return new Request('http://localhost:3000/api/sync', {
      method: 'POST',
      body: JSON.stringify({ puuid, summonerId }),
    })
  }

  it('should sync matches from Riot API', async () => {
    const mockMatchIds = ['match-1', 'match-2', 'match-3']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 7,
            totalMinionsKilled: 216,
            visionScore: 24,
            goldEarned: 14500,
            totalDamageDealtToChampions: 32000,
            challenges: {},
          },
        ],
      },
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValue(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValue({
      championName: 'Jinx',
      role: 'ADC',
      win: true,
      kills: 10,
      deaths: 2,
      assists: 7,
      csPerMinute: 7.2,
      visionScore: 24,
      goldEarned: 14500,
      damageDealt: 32000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    })

    ;(prisma.match.upsert as jest.Mock).mockResolvedValue({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValue({})

    const request = createRequestBody('test-puuid', 'summoner-123')
    const response = await POST(request)

    expect(getMatchIds).toHaveBeenCalledWith('test-puuid')
    expect(getMatch).toHaveBeenCalledTimes(3)
    expect(response.ok).toBe(true)

    const data = await response.json()
    expect(data).toEqual({ success: true })
  })

  it('should create match records in database', async () => {
    const mockMatchIds = ['match-1']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 7,
            totalMinionsKilled: 216,
            visionScore: 24,
            goldEarned: 14500,
            totalDamageDealtToChampions: 32000,
            challenges: {},
          },
        ],
      },
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValueOnce(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValueOnce({
      championName: 'Jinx',
      role: 'ADC',
      win: true,
      kills: 10,
      deaths: 2,
      assists: 7,
      csPerMinute: 7.2,
      visionScore: 24,
      goldEarned: 14500,
      damageDealt: 32000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    })

    ;(prisma.match.upsert as jest.Mock).mockResolvedValueOnce({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValueOnce({})

    const request = createRequestBody('test-puuid', 'summoner-123')
    await POST(request)

    expect(prisma.match.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'match-1' },
        update: {},
        create: expect.objectContaining({
          id: 'match-1',
          queueId: 420,
          gameDuration: 1800,
          gameCreation: BigInt(1234567890000),
        }),
      })
    )
  })

  it('should create match participant records', async () => {
    const mockMatchIds = ['match-1']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Caitlyn',
            teamPosition: 'ADC',
            win: false,
            kills: 8,
            deaths: 5,
            assists: 10,
            totalMinionsKilled: 200,
            visionScore: 20,
            goldEarned: 13000,
            totalDamageDealtToChampions: 28000,
            challenges: {},
          },
        ],
      },
    }

    const parsedParticipant = {
      championName: 'Caitlyn',
      role: 'ADC',
      win: false,
      kills: 8,
      deaths: 5,
      assists: 10,
      csPerMinute: 6.7,
      visionScore: 20,
      goldEarned: 13000,
      damageDealt: 28000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValueOnce(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValueOnce(parsedParticipant)
    ;(prisma.match.upsert as jest.Mock).mockResolvedValueOnce({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValueOnce({})

    const request = createRequestBody('test-puuid', 'summoner-456')
    await POST(request)

    expect(prisma.matchParticipant.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          matchId: 'match-1',
          summonerId: 'summoner-456',
          ...parsedParticipant,
        }),
      })
    )
  })

  it('should handle multiple matches', async () => {
    const mockMatchIds = ['match-1', 'match-2', 'match-3']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 7,
            totalMinionsKilled: 216,
            visionScore: 24,
            goldEarned: 14500,
            totalDamageDealtToChampions: 32000,
            challenges: {},
          },
        ],
      },
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValue(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValue({
      championName: 'Jinx',
      role: 'ADC',
      win: true,
      kills: 10,
      deaths: 2,
      assists: 7,
      csPerMinute: 7.2,
      visionScore: 24,
      goldEarned: 14500,
      damageDealt: 32000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    })

    ;(prisma.match.upsert as jest.Mock).mockResolvedValue({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValue({})

    const request = createRequestBody('test-puuid', 'summoner-123')
    await POST(request)

    expect(getMatch).toHaveBeenCalledTimes(3)
    expect(prisma.match.upsert).toHaveBeenCalledTimes(3)
    expect(prisma.matchParticipant.create).toHaveBeenCalledTimes(3)
  })

  it('should upsert matches (update if exists, create if not)', async () => {
    const mockMatchIds = ['existing-match', 'new-match']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 7,
            totalMinionsKilled: 216,
            visionScore: 24,
            goldEarned: 14500,
            totalDamageDealtToChampions: 32000,
            challenges: {},
          },
        ],
      },
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValue(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValue({
      championName: 'Jinx',
      role: 'ADC',
      win: true,
      kills: 10,
      deaths: 2,
      assists: 7,
      csPerMinute: 7.2,
      visionScore: 24,
      goldEarned: 14500,
      damageDealt: 32000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    })

    ;(prisma.match.upsert as jest.Mock).mockResolvedValue({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValue({})

    const request = createRequestBody('test-puuid', 'summoner-123')
    await POST(request)

    // Verify upsert was called correctly
    expect(prisma.match.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: {},
      })
    )
  })

  it('should parse participant data correctly', async () => {
    const mockMatchIds = ['match-1']
    const mockMatch = {
      info: {
        queueId: 420,
        gameDuration: 1800,
        gameCreation: 1234567890000,
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Ezreal',
            teamPosition: 'ADC',
            win: true,
            kills: 12,
            deaths: 3,
            assists: 8,
            totalMinionsKilled: 240,
            visionScore: 30,
            goldEarned: 15000,
            totalDamageDealtToChampions: 35000,
            challenges: {},
          },
        ],
      },
    }

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)
    ;(getMatch as jest.Mock).mockResolvedValueOnce(mockMatch)
    ;(parseParticipant as jest.Mock).mockReturnValueOnce({
      championName: 'Ezreal',
      role: 'ADC',
      win: true,
      kills: 12,
      deaths: 3,
      assists: 8,
      csPerMinute: 8.0,
      visionScore: 30,
      goldEarned: 15000,
      damageDealt: 35000,
      goldDiffAt15: 0,
      deathsBeforeObj: 0,
    })

    ;(prisma.match.upsert as jest.Mock).mockResolvedValueOnce({})
    ;(prisma.matchParticipant.create as jest.Mock).mockResolvedValueOnce({})

    const request = createRequestBody('test-puuid', 'summoner-123')
    await POST(request)

    expect(parseParticipant).toHaveBeenCalledWith(mockMatch, 'test-puuid')
  })

  it('should return success response', async () => {
    const mockMatchIds: string[] = []

    ;(getMatchIds as jest.Mock).mockResolvedValueOnce(mockMatchIds)

    const request = createRequestBody('test-puuid', 'summoner-123')
    const response = await POST(request)

    const data = await response.json()
    expect(data).toEqual({ success: true })
  })

  it('should handle empty match list', async () => {
    ;(getMatchIds as jest.Mock).mockResolvedValueOnce([])

    const request = createRequestBody('test-puuid', 'summoner-123')
    const response = await POST(request)

    expect(getMatch).not.toHaveBeenCalled()
    expect(prisma.match.upsert).not.toHaveBeenCalled()
    expect(prisma.matchParticipant.create).not.toHaveBeenCalled()

    const data = await response.json()
    expect(data).toEqual({ success: true })
  })
})
