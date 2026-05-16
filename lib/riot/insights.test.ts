import {
  analyzeMatchPerformance,
  adaptJokeWithContext,
  deduplicateAndAdaptJokes,
  getMainInsightJoke,
} from '@/lib/riot/insights'

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Adapted joke version from OpenAI',
              },
            },
          ],
        }),
      },
    },
  }))
})

describe('Riot Insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('analyzeMatchPerformance', () => {
    it('should detect high death count', () => {
      const mockMatch = {
        info: {
          gameDuration: 1800,
          participants: [
            {
              puuid: 'test-puuid',
              deaths: 8,
              kills: 2,
              assists: 3,
              totalMinionsKilled: 150,
              goldEarned: 10000,
              totalDamageDealtToChampions: 50000,
              visionScore: 15,
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              win: false,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 20 } } },
            { objectives: { champion: { kills: 15 } } },
          ],
        },
      }

      const insights = analyzeMatchPerformance(mockMatch, 'test-puuid')
      expect(insights.length).toBeGreaterThan(0)
      expect(insights.some((i) => i.title === 'Suragressivité détectée')).toBe(true)
    })

    it('should return insights array', () => {
      const mockMatch = {
        info: {
          gameDuration: 1800,
          participants: [
            {
              puuid: 'test-puuid',
              deaths: 2,
              kills: 5,
              assists: 8,
              totalMinionsKilled: 250,
              goldEarned: 15000,
              totalDamageDealtToChampions: 80000,
              visionScore: 25,
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 25 } } },
            { objectives: { champion: { kills: 10 } } },
          ],
        },
      }

      const insights = analyzeMatchPerformance(mockMatch, 'test-puuid')
      expect(Array.isArray(insights)).toBe(true)
    })

    it('should include joke in each insight', () => {
      const mockMatch = {
        info: {
          gameDuration: 2400,
          participants: [
            {
              puuid: 'test-puuid',
              deaths: 6,
              kills: 3,
              assists: 5,
              totalMinionsKilled: 100,
              goldEarned: 9000,
              totalDamageDealtToChampions: 45000,
              visionScore: 8,
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              win: false,
              challenges: {
                goldPerMinute: 250,
              },
            },
          ],
          teams: [
            { objectives: { champion: { kills: 15 } } },
            { objectives: { champion: { kills: 20 } } },
          ],
        },
      }

      const insights = analyzeMatchPerformance(mockMatch, 'test-puuid')
      insights.forEach((insight) => {
        expect(insight).toHaveProperty('joke')
        expect(insight.joke).toBeTruthy()
      })
    })
  })

  describe('getMainInsightJoke', () => {
    it('should return victory message for win', () => {
      const mockMatch = {
        info: {
          gameDuration: 1800,
          participants: [
            {
              puuid: 'test-puuid',
              deaths: 2,
              kills: 10,
              assists: 5,
              totalMinionsKilled: 250,
              goldEarned: 15000,
              totalDamageDealtToChampions: 80000,
              visionScore: 25,
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 25 } } },
            { objectives: { champion: { kills: 10 } } },
          ],
        },
      }

      const joke = getMainInsightJoke(mockMatch, 'test-puuid')
      expect(joke).toContain('Victoire')
    })

    it('should return first insight joke if available', () => {
      const mockMatch = {
        info: {
          gameDuration: 2400,
          participants: [
            {
              puuid: 'test-puuid',
              deaths: 10,
              kills: 1,
              assists: 2,
              totalMinionsKilled: 80,
              goldEarned: 8000,
              totalDamageDealtToChampions: 30000,
              visionScore: 5,
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              win: false,
              challenges: {
                goldPerMinute: 200,
              },
            },
          ],
          teams: [
            { objectives: { champion: { kills: 10 } } },
            { objectives: { champion: { kills: 25 } } },
          ],
        },
      }

      const joke = getMainInsightJoke(mockMatch, 'test-puuid')
      expect(joke).toBeTruthy()
    })
  })

  describe('deduplicateAndAdaptJokes', () => {
    it('should not modify insights if no duplicates', async () => {
      const mockMatchesWithInsights = [
        {
          match: { info: { gameDuration: 1800, participants: [] } },
          insights: [{ joke: 'Unique joke 1', title: 'Insight 1' }],
          puuid: 'test-puuid-1',
        },
        {
          match: { info: { gameDuration: 2100, participants: [] } },
          insights: [{ joke: 'Unique joke 2', title: 'Insight 2' }],
          puuid: 'test-puuid-2',
        },
      ]

      const result = await deduplicateAndAdaptJokes(mockMatchesWithInsights)
      expect(result.length).toBe(2)
      expect(result[0].insights[0].joke).toBe('Unique joke 1')
      expect(result[1].insights[0].joke).toBe('Unique joke 2')
    })

    it('should detect and adapt duplicate jokes', async () => {
      const mockMatchesWithInsights = [
        {
          match: { info: { gameDuration: 1800, participants: [{ puuid: 'test-1' }] } },
          insights: [{ joke: 'Duplicate joke', title: 'Insight 1' }],
          puuid: 'test-puuid-1',
        },
        {
          match: { info: { gameDuration: 2100, participants: [{ puuid: 'test-2' }] } },
          insights: [{ joke: 'Duplicate joke', title: 'Insight 2' }],
          puuid: 'test-puuid-2',
        },
      ]

      const result = await deduplicateAndAdaptJokes(mockMatchesWithInsights)
      
      // First occurrence should remain unchanged
      expect(result[0].insights[0].joke).toBe('Duplicate joke')
      expect(result[0].insights[0].isAdapted).toBeUndefined()
      
      // Second occurrence should be adapted
      expect(result[1].insights[0].isAdapted).toBe(true)
      expect(result[1].insights[0].joke).toBe('Adapted joke version from OpenAI')
    })

    it('should handle empty insights list', async () => {
      const mockMatchesWithInsights = []
      const result = await deduplicateAndAdaptJokes(mockMatchesWithInsights)
      expect(result).toEqual([])
    })

    it('should preserve non-joke insights', async () => {
      const mockMatchesWithInsights = [
        {
          match: { info: { gameDuration: 1800, participants: [] } },
          insights: [
            { title: 'Insight 1', description: 'No joke here' },
            { joke: 'First joke', title: 'Insight 2' },
          ],
          puuid: 'test-puuid-1',
        },
      ]

      const result = await deduplicateAndAdaptJokes(mockMatchesWithInsights)
      expect(result[0].insights[0].description).toBe('No joke here')
      expect(result[0].insights[1].joke).toBe('First joke')
    })

    it('should handle multiple jokes in one insight', async () => {
      const mockMatchesWithInsights = [
        {
          match: { info: { gameDuration: 1800, participants: [] } },
          insights: [
            { joke: 'Duplicate', title: 'A', description: 'First' },
            { joke: 'Duplicate', title: 'B', description: 'Second' },
          ],
          puuid: 'test-puuid-1',
        },
      ]

      const result = await deduplicateAndAdaptJokes(mockMatchesWithInsights)
      // First should remain, second should be adapted
      expect(result[0].insights[0].isAdapted).toBeUndefined()
      expect(result[0].insights[1].isAdapted).toBe(true)
    })
  })

  describe('adaptJokeWithContext', () => {
    it('should return adapted joke from OpenAI', async () => {
      const mockMatch = {
        info: {
          gameDuration: 1800,
          participants: [
            {
              puuid: 'test-puuid',
              championName: 'Ahri',
              kills: 3,
              deaths: 8,
              assists: 4,
              totalMinionsKilled: 150,
              goldEarned: 10000,
              totalDamageDealtToChampions: 50000,
            },
          ],
        },
      }

      const joke = await adaptJokeWithContext(
        'Original joke',
        mockMatch,
        'test-puuid',
        'Overaggression'
      )

      expect(joke).toBe('Adapted joke version from OpenAI')
    })

    it('should return original joke if participant not found', async () => {
      const mockMatch = {
        info: {
          gameDuration: 1800,
          participants: [],
        },
      }

      const joke = await adaptJokeWithContext(
        'Original joke',
        mockMatch,
        'nonexistent-puuid',
        'Overaggression'
      )

      expect(joke).toBe('Original joke')
    })
  })
})
