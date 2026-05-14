import { parseParticipant } from '@/lib/riot/parser'

describe('parseParticipant', () => {
  const mockMatch = {
    info: {
      gameDuration: 1800, // 30 minutes in seconds
      participants: [
        {
          puuid: 'test-puuid-123',
          championName: 'Jinx',
          teamPosition: 'ADC',
          win: true,
          kills: 12,
          deaths: 3,
          assists: 8,
          totalMinionsKilled: 216, // 7.2 cs/min
          visionScore: 24,
          goldEarned: 14500,
          totalDamageDealtToChampions: 32000,
          challenges: {
            goldPerMinute: 2500,
            deathsByEnemyChamps: 3,
          },
        },
        {
          puuid: 'other-puuid-456',
          championName: 'Caitlyn',
          teamPosition: 'ADC',
          win: true,
          kills: 8,
          deaths: 2,
          assists: 10,
          totalMinionsKilled: 198,
          visionScore: 20,
          goldEarned: 13200,
          totalDamageDealtToChampions: 28000,
          challenges: {
            goldPerMinute: 2200,
            deathsByEnemyChamps: 2,
          },
        },
      ],
    },
  }

  it('should parse a participant correctly', () => {
    const result = parseParticipant(mockMatch, 'test-puuid-123')

    expect(result).toEqual({
      championName: 'Jinx',
      role: 'ADC',
      win: true,
      kills: 12,
      deaths: 3,
      assists: 8,
      csPerMinute: expect.any(Number),
      visionScore: 24,
      goldEarned: 14500,
      damageDealt: 32000,
      goldDiffAt15: 2500,
      deathsBeforeObj: 3,
    })
  })

  it('should calculate CS per minute correctly', () => {
    const result = parseParticipant(mockMatch, 'test-puuid-123')
    const expectedCsPerMin = (216 / 1800) * 60 // = 7.2
    expect(result.csPerMinute).toBeCloseTo(expectedCsPerMin, 2)
  })

  it('should find the correct participant by PUUID', () => {
    const result = parseParticipant(mockMatch, 'test-puuid-123')
    expect(result.championName).toBe('Jinx')

    const result2 = parseParticipant(mockMatch, 'other-puuid-456')
    expect(result2.championName).toBe('Caitlyn')
  })

  it('should handle loss correctly', () => {
    const matchWithLoss = {
      ...mockMatch,
      info: {
        ...mockMatch.info,
        participants: [
          {
            ...mockMatch.info.participants[0],
            puuid: 'test-puuid-loss',
            win: false,
          },
        ],
      },
    }

    const result = parseParticipant(matchWithLoss, 'test-puuid-loss')
    expect(result.win).toBe(false)
  })

  it('should handle challenges with missing fields', () => {
    const matchWithoutChallenges = {
      info: {
        gameDuration: 1800,
        participants: [
          {
            puuid: 'test-puuid-no-challenges',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 5,
            totalMinionsKilled: 200,
            visionScore: 20,
            goldEarned: 14000,
            totalDamageDealtToChampions: 30000,
          },
        ],
      },
    }

    const result = parseParticipant(matchWithoutChallenges, 'test-puuid-no-challenges')

    expect(result.goldDiffAt15).toBeUndefined()
    expect(result.deathsBeforeObj).toBeUndefined()
  })

  it('should calculate different CS per minute for different game durations', () => {
    const shortMatch = {
      info: {
        gameDuration: 900, // 15 minutes
        participants: [
          {
            puuid: 'test-puuid',
            championName: 'Jinx',
            teamPosition: 'ADC',
            win: true,
            kills: 5,
            deaths: 1,
            assists: 3,
            totalMinionsKilled: 120, // 8 cs/min
            visionScore: 15,
            goldEarned: 8000,
            totalDamageDealtToChampions: 15000,
            challenges: {},
          },
        ],
      },
    }

    const result = parseParticipant(shortMatch, 'test-puuid')
    const expectedCsPerMin = (120 / 900) * 60 // = 8
    expect(result.csPerMinute).toBeCloseTo(expectedCsPerMin, 2)
  })

  it('should handle 0 CS correctly', () => {
    const matchWithNoCsMatch = {
      info: {
        gameDuration: 1800,
        participants: [
          {
            puuid: 'test-puuid-no-cs',
            championName: 'Jinx',
            teamPosition: 'SUPPORT',
            win: true,
            kills: 2,
            deaths: 0,
            assists: 15,
            totalMinionsKilled: 0,
            visionScore: 35,
            goldEarned: 5000,
            totalDamageDealtToChampions: 8000,
            challenges: {},
          },
        ],
      },
    }

    const result = parseParticipant(matchWithNoCsMatch, 'test-puuid-no-cs')
    expect(result.csPerMinute).toBe(0)
  })

  it('should throw when participant not found', () => {
    expect(() => {
      parseParticipant(mockMatch, 'non-existent-puuid')
    }).toThrow()
  })

  it('should preserve all numeric values accurately', () => {
    const result = parseParticipant(mockMatch, 'test-puuid-123')

    expect(typeof result.kills).toBe('number')
    expect(typeof result.deaths).toBe('number')
    expect(typeof result.assists).toBe('number')
    expect(typeof result.visionScore).toBe('number')
    expect(typeof result.goldEarned).toBe('number')
    expect(typeof result.damageDealt).toBe('number')
  })
})
