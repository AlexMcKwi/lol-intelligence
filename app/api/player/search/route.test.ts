import { GET } from '@/app/api/player/search/route'
import * as riotClient from '@/lib/riot/client'
import * as riotMatches from '@/lib/riot/matches'
import * as riotParser from '@/lib/riot/parser'
import * as riotInsights from '@/lib/riot/insights'

// Mock all Riot API dependencies
jest.mock('@/lib/riot/client')
jest.mock('@/lib/riot/matches')
jest.mock('@/lib/riot/parser')
jest.mock('@/lib/riot/insights')

describe('GET /api/player/search - Match Jokes Retrieval', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('retrieving jokes for each match from gameName and tagLine', () => {
    it('should fetch player and return jokes for all recent matches', async () => {
      // Mock player data
      const mockAccount = {
        puuid: 'test-puuid-123',
        gameName: 'TestPlayer',
        tagLine: 'NA1',
      }

      const mockSummoner = {
        id: 'summoner-123',
        name: 'TestPlayer',
        summonerLevel: 150,
      }

      // Mock match IDs
      const mockMatchIds = ['match-1', 'match-2', 'match-3', 'match-4', 'match-5']

      // Mock detailed match data with jokes
      const mockMatches = [
        {
          info: {
            gameDuration: 1800,
            gameCreation: Date.now() - 86400000,
            participants: [
              {
                puuid: 'test-puuid-123',
                championName: 'Ahri',
                teamPosition: 'MIDDLE',
                kills: 5,
                deaths: 3,
                assists: 8,
                totalMinionsKilled: 250,
                goldEarned: 15000,
                totalDamageDealtToChampions: 80000,
                visionScore: 25,
                win: true,
              },
            ],
            teams: [
              { objectives: { champion: { kills: 25 } } },
              { objectives: { champion: { kills: 10 } } },
            ],
          },
        },
        {
          info: {
            gameDuration: 2100,
            gameCreation: Date.now() - 172800000,
            participants: [
              {
                puuid: 'test-puuid-123',
                championName: 'Lux',
                teamPosition: 'SUPPORT',
                kills: 2,
                deaths: 1,
                assists: 15,
                totalMinionsKilled: 80,
                goldEarned: 12000,
                totalDamageDealtToChampions: 60000,
                visionScore: 35,
                win: true,
              },
            ],
            teams: [
              { objectives: { champion: { kills: 30 } } },
              { objectives: { champion: { kills: 15 } } },
            ],
          },
        },
        {
          info: {
            gameDuration: 1500,
            gameCreation: Date.now() - 259200000,
            participants: [
              {
                puuid: 'test-puuid-123',
                championName: 'Ahri',
                teamPosition: 'MIDDLE',
                kills: 3,
                deaths: 7,
                assists: 4,
                totalMinionsKilled: 150,
                goldEarned: 10000,
                totalDamageDealtToChampions: 45000,
                visionScore: 12,
                win: false,
              },
            ],
            teams: [
              { objectives: { champion: { kills: 15 } } },
              { objectives: { champion: { kills: 25 } } },
            ],
          },
        },
      ]

      // Setup mocks
      jest.spyOn(riotClient, 'getAccountByGameName').mockResolvedValue(mockAccount)
      jest.spyOn(riotClient, 'getSummonerByPuuid').mockResolvedValue(mockSummoner)
      jest.spyOn(riotMatches, 'getMatchIds').mockResolvedValue(mockMatchIds)

      // Mock individual match fetches
      jest
        .spyOn(riotMatches, 'getMatch')
        .mockResolvedValueOnce(mockMatches[0])
        .mockResolvedValueOnce(mockMatches[1])
        .mockResolvedValueOnce(mockMatches[2])

      // Mock parsed participants
      jest
        .spyOn(riotParser, 'parseParticipant')
        .mockReturnValueOnce({
          championName: 'Ahri',
          kills: 5,
          deaths: 3,
          assists: 8,
          cs: 250,
          gold: 15000,
          damage: 80000,
          vision: 25,
          lane: 'MIDDLE',
          won: true,
        })
        .mockReturnValueOnce({
          championName: 'Lux',
          kills: 2,
          deaths: 1,
          assists: 15,
          cs: 80,
          gold: 12000,
          damage: 60000,
          vision: 35,
          lane: 'SUPPORT',
          won: true,
        })
        .mockReturnValueOnce({
          championName: 'Ahri',
          kills: 3,
          deaths: 7,
          assists: 4,
          cs: 150,
          gold: 10000,
          damage: 45000,
          vision: 12,
          lane: 'MIDDLE',
          won: false,
        })

      // Mock jokes for each match
      jest
        .spyOn(riotInsights, 'getMainInsightJoke')
        .mockReturnValueOnce("Votre minimap semble purement décorative.")
        .mockReturnValueOnce("L'équipe ennemie apprécie vos donations.")
        .mockReturnValueOnce("Votre minimap semble purement décorative.") // Duplicate joke

      // Make the request
      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=TestPlayer&tagLine=NA1'
      )
      const response = await GET(request)
      const data = await response.json()

      // Assertions
      expect(response.status).toBe(200)
      expect(data.player).toBeDefined()
      expect(data.player.name).toBe('TestPlayer#NA1')
      expect(data.player.puuid).toBe('test-puuid-123')
      expect(data.player.level).toBe(150)

      expect(data.matches).toBeDefined()
      expect(data.matches.length).toBe(3)

      // Verify each match has required fields
      data.matches.forEach((match: any, index: number) => {
        expect(match.id).toBe(`match-${index + 1}`)
        expect(match.championName).toBeDefined()
        expect(match.kills).toBeDefined()
        expect(match.deaths).toBeDefined()
        expect(match.assists).toBeDefined()
        expect(match.joke).toBeDefined()
        expect(typeof match.joke).toBe('string')
        expect(match.duration).toBeDefined()
        expect(match.timestamp).toBeDefined()
      })
    })

    it('should retrieve jokes with deduplication context', async () => {
      const mockAccount = {
        puuid: 'player-456',
        gameName: 'ProPlayer',
        tagLine: 'EUW',
      }

      const mockSummoner = {
        id: 'summoner-456',
        name: 'ProPlayer',
        summonerLevel: 200,
      }

      const mockMatchIds = ['m-1', 'm-2', 'm-3', 'm-4', 'm-5']

      // Multiple matches with the same champion generating similar jokes
      const mockMatches = Array(5)
        .fill(null)
        .map((_, i) => ({
          info: {
            gameDuration: 1800 + i * 300,
            gameCreation: Date.now() - i * 86400000,
            participants: [
              {
                puuid: 'player-456',
                championName: 'Lee Sin',
                teamPosition: 'JUNGLE',
                kills: 5 + i,
                deaths: 2 + i,
                assists: 7 + i,
                totalMinionsKilled: 200 + i * 10,
                goldEarned: 15000 + i * 1000,
                totalDamageDealtToChampions: 70000 + i * 5000,
                visionScore: 20 + i,
                win: i % 2 === 0,
              },
            ],
            teams: [
              { objectives: { champion: { kills: 20 + i } } },
              { objectives: { champion: { kills: 15 + i } } },
            ],
          },
        }))

      jest.spyOn(riotClient, 'getAccountByGameName').mockResolvedValue(mockAccount)
      jest.spyOn(riotClient, 'getSummonerByPuuid').mockResolvedValue(mockSummoner)
      jest.spyOn(riotMatches, 'getMatchIds').mockResolvedValue(mockMatchIds)

      mockMatches.forEach((match) => {
        jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce(match)
      })

      mockMatches.forEach((_, i) => {
        jest.spyOn(riotParser, 'parseParticipant').mockReturnValueOnce({
          championName: 'Lee Sin',
          kills: 5 + i,
          deaths: 2 + i,
          assists: 7 + i,
          cs: 200 + i * 10,
          gold: 15000 + i * 1000,
          damage: 70000 + i * 5000,
          vision: 20 + i,
          lane: 'JUNGLE',
          won: i % 2 === 0,
        })
      })

      // Simulating joke deduplication - repeated jokes with adaptation on 2nd occurrence
      const jokes = [
        'Votre jungle est aussi vide que votre map awareness.',
        'Votre jungle est aussi vide que votre map awareness.', // Duplicate
        'Votre jungle est aussi vide que votre vision du map.',  // Adapted version
        'Même les camps rouges appréhendent votre arrivée.',     // Different joke
        'Vous effectuez vos rotations comme en chargement.',      // Another joke
      ]

      jokes.forEach((joke) => {
        jest.spyOn(riotInsights, 'getMainInsightJoke').mockReturnValueOnce(joke)
      })

      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=ProPlayer&tagLine=EUW'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.matches.length).toBe(5)

      // Verify all jokes are present
      data.matches.forEach((match: any, index: number) => {
        expect(match.joke).toBe(jokes[index])
      })

      // Verify deduplication detection (same jokes appear multiple times)
      const jokeFrequency = data.matches.reduce(
        (acc: Record<string, number>, match: any) => {
          acc[match.joke] = (acc[match.joke] || 0) + 1
          return acc
        },
        {}
      )

      expect(jokeFrequency['Votre jungle est aussi vide que votre map awareness.']).toBe(2)
    })

    it('should handle missing gameName or tagLine parameters', async () => {
      // Test missing gameName
      const request1 = new Request(
        'http://localhost:3000/api/player/search?gameName=TestPlayer'
      )
      const response1 = await GET(request1)
      expect(response1.status).toBe(400)

      const data1 = await response1.json()
      expect(data1.error).toContain('gameName and tagLine are required')

      // Test missing tagLine
      const request2 = new Request(
        'http://localhost:3000/api/player/search?tagLine=NA1'
      )
      const response2 = await GET(request2)
      expect(response2.status).toBe(400)

      const data2 = await response2.json()
      expect(data2.error).toContain('gameName and tagLine are required')
    })

    it('should limit matches to 20 results', async () => {
      const mockAccount = {
        puuid: 'player-789',
        gameName: 'ManyMatches',
        tagLine: 'KR',
      }

      const mockSummoner = {
        id: 'summoner-789',
        name: 'ManyMatches',
        summonerLevel: 250,
      }

      // Return 25 matches but should only process first 20
      const mockMatchIds = Array.from({ length: 25 }, (_, i) => `match-${i + 1}`)

      jest.spyOn(riotClient, 'getAccountByGameName').mockResolvedValue(mockAccount)
      jest.spyOn(riotClient, 'getSummonerByPuuid').mockResolvedValue(mockSummoner)
      jest.spyOn(riotMatches, 'getMatchIds').mockResolvedValue(mockMatchIds)

      // Mock only 20 match fetches
      for (let i = 0; i < 20; i++) {
        jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce({
          info: {
            gameDuration: 1800,
            gameCreation: Date.now() - i * 86400000,
            participants: [
              {
                puuid: 'player-789',
                championName: `Champion${i}`,
                teamPosition: 'MIDDLE',
                kills: 3,
                deaths: 2,
                assists: 5,
                totalMinionsKilled: 200,
                goldEarned: 12000,
                totalDamageDealtToChampions: 50000,
                visionScore: 15,
                win: true,
              },
            ],
            teams: [
              { objectives: { champion: { kills: 20 } } },
              { objectives: { champion: { kills: 10 } } },
            ],
          },
        })

        jest.spyOn(riotParser, 'parseParticipant').mockReturnValueOnce({
          championName: `Champion${i}`,
          kills: 3,
          deaths: 2,
          assists: 5,
          cs: 200,
          gold: 12000,
          damage: 50000,
          vision: 15,
          lane: 'MIDDLE',
          won: true,
        })

        jest
          .spyOn(riotInsights, 'getMainInsightJoke')
          .mockReturnValueOnce(`Joke for match ${i + 1}`)
      }

      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=ManyMatches&tagLine=KR'
      )
      const response = await GET(request)
      const data = await response.json()

      // Should only return 20 matches
      expect(data.matches.length).toBe(20)
      expect(riotMatches.getMatch).toHaveBeenCalledTimes(20)
    })

    it('should handle API errors gracefully', async () => {
      jest
        .spyOn(riotClient, 'getAccountByGameName')
        .mockRejectedValue(new Error('Player not found'))

      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=NonExistent&tagLine=NA1'
      )
      const response = await GET(request)

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toContain('Player not found or API error')
    })

    it('should handle individual match parsing errors', async () => {
      const mockAccount = {
        puuid: 'player-error',
        gameName: 'ErrorPlayer',
        tagLine: 'NA1',
      }

      const mockSummoner = {
        id: 'summoner-error',
        name: 'ErrorPlayer',
        summonerLevel: 100,
      }

      const mockMatchIds = ['match-1', 'match-2', 'match-3']

      jest.spyOn(riotClient, 'getAccountByGameName').mockResolvedValue(mockAccount)
      jest.spyOn(riotClient, 'getSummonerByPuuid').mockResolvedValue(mockSummoner)
      jest.spyOn(riotMatches, 'getMatchIds').mockResolvedValue(mockMatchIds)

      // First match succeeds, second fails, third succeeds
      jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce({
        info: {
          gameDuration: 1800,
          gameCreation: Date.now(),
          participants: [
            {
              puuid: 'player-error',
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              kills: 5,
              deaths: 3,
              assists: 8,
              totalMinionsKilled: 250,
              goldEarned: 15000,
              totalDamageDealtToChampions: 80000,
              visionScore: 25,
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 20 } } },
            { objectives: { champion: { kills: 10 } } },
          ],
        },
      })

      jest.spyOn(riotMatches, 'getMatch').mockRejectedValueOnce(new Error('Match not found'))

      jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce({
        info: {
          gameDuration: 2100,
          gameCreation: Date.now() - 86400000,
          participants: [
            {
              puuid: 'player-error',
              championName: 'Lux',
              teamPosition: 'SUPPORT',
              kills: 2,
              deaths: 1,
              assists: 15,
              totalMinionsKilled: 80,
              goldEarned: 12000,
              totalDamageDealtToChampions: 60000,
              visionScore: 35,
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 30 } } },
            { objectives: { champion: { kills: 15 } } },
          ],
        },
      })

      jest.spyOn(riotParser, 'parseParticipant').mockReturnValueOnce({
        championName: 'Ahri',
        kills: 5,
        deaths: 3,
        assists: 8,
        cs: 250,
        gold: 15000,
        damage: 80000,
        vision: 25,
        lane: 'MIDDLE',
        won: true,
      })

      jest.spyOn(riotParser, 'parseParticipant').mockReturnValueOnce({
        championName: 'Lux',
        kills: 2,
        deaths: 1,
        assists: 15,
        cs: 80,
        gold: 12000,
        damage: 60000,
        vision: 35,
        lane: 'SUPPORT',
        won: true,
      })

      jest
        .spyOn(riotInsights, 'getMainInsightJoke')
        .mockReturnValueOnce('First joke')
        .mockReturnValueOnce('Third joke')

      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=ErrorPlayer&tagLine=NA1'
      )
      const response = await GET(request)
      const data = await response.json()

      // Should return successfully with only valid matches
      expect(response.status).toBe(200)
      expect(data.matches.length).toBe(2) // Only successful matches
      expect(data.matches[0].joke).toBe('First joke')
      expect(data.matches[1].joke).toBe('Third joke')
    })
  })

  describe('dashboard integration scenarios', () => {
    it('should provide complete match data for dashboard display', async () => {
      const mockAccount = {
        puuid: 'dashboard-player',
        gameName: 'DashboardTest',
        tagLine: 'NA1',
      }

      const mockSummoner = {
        id: 'summoner-dash',
        name: 'DashboardTest',
        summonerLevel: 175,
      }

      const mockMatchIds = ['dash-m1', 'dash-m2']

      jest.spyOn(riotClient, 'getAccountByGameName').mockResolvedValue(mockAccount)
      jest.spyOn(riotClient, 'getSummonerByPuuid').mockResolvedValue(mockSummoner)
      jest.spyOn(riotMatches, 'getMatchIds').mockResolvedValue(mockMatchIds)

      jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce({
        info: {
          gameDuration: 1800,
          gameCreation: Date.now() - 3600000,
          participants: [
            {
              puuid: 'dashboard-player',
              championName: 'Ahri',
              teamPosition: 'MIDDLE',
              kills: 7,
              deaths: 2,
              assists: 10,
              totalMinionsKilled: 280,
              goldEarned: 16500,
              totalDamageDealtToChampions: 95000,
              visionScore: 28,
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 28 } } },
            { objectives: { champion: { kills: 12 } } },
          ],
        },
      })

      jest.spyOn(riotMatches, 'getMatch').mockResolvedValueOnce({
        info: {
          gameDuration: 2100,
          gameCreation: Date.now() - 7200000,
          participants: [
            {
              puuid: 'dashboard-player',
              championName: 'Lux',
              teamPosition: 'SUPPORT',
              kills: 3,
              deaths: 0,
              assists: 18,
              totalMinionsKilled: 95,
              goldEarned: 13200,
              totalDamageDealtToChampions: 72000,
              visionScore: 42,
              win: true,
            },
          ],
          teams: [
            { objectives: { champion: { kills: 32 } } },
            { objectives: { champion: { kills: 14 } } },
          ],
        },
      })

      jest
        .spyOn(riotParser, 'parseParticipant')
        .mockReturnValueOnce({
          championName: 'Ahri',
          kills: 7,
          deaths: 2,
          assists: 10,
          cs: 280,
          gold: 16500,
          damage: 95000,
          vision: 28,
          lane: 'MIDDLE',
          won: true,
        })
        .mockReturnValueOnce({
          championName: 'Lux',
          kills: 3,
          deaths: 0,
          assists: 18,
          cs: 95,
          gold: 13200,
          damage: 72000,
          vision: 42,
          lane: 'SUPPORT',
          won: true,
        })

      jest
        .spyOn(riotInsights, 'getMainInsightJoke')
        .mockReturnValueOnce('Ahri mid joke')
        .mockReturnValueOnce('Lux support joke')

      const request = new Request(
        'http://localhost:3000/api/player/search?gameName=DashboardTest&tagLine=NA1'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)

      // Verify match data structure for dashboard
      expect(data.matches[0]).toMatchObject({
        championName: 'Ahri',
        kills: 7,
        deaths: 2,
        assists: 10,
        cs: 280,
        gold: 16500,
        damage: 95000,
        vision: 28,
        lane: 'MIDDLE',
        won: true,
        joke: 'Ahri mid joke',
        duration: 1800,
        timestamp: expect.any(Number),
      })

      expect(data.matches[1]).toMatchObject({
        championName: 'Lux',
        kills: 3,
        deaths: 0,
        assists: 18,
        cs: 95,
        gold: 13200,
        damage: 72000,
        vision: 42,
        lane: 'SUPPORT',
        won: true,
        joke: 'Lux support joke',
        duration: 2100,
        timestamp: expect.any(Number),
      })
    })
  })
})
