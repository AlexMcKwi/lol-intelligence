import { GET } from '@/app/api/insights/route'
import { prisma } from '@/lib/prisma'
import { generateInsights } from '@/lib/insights/engine'
import { analyzeMatchPerformance, deduplicateAndAdaptJokes } from '@/lib/riot/insights'
import { NextResponse } from 'next/server'

// Mock the dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    matchParticipant: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/insights/engine', () => ({
  generateInsights: jest.fn(),
}))

jest.mock('@/lib/riot/insights', () => ({
  analyzeMatchPerformance: jest.fn(),
  deduplicateAndAdaptJokes: jest.fn(),
}))

describe('GET /api/insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return insights for a given user', async () => {
    const mockMatchParticipants = [
      {
        puuid: 'test-puuid-1',
        match: { info: { gameDuration: 1800, participants: [] } },
      },
      {
        puuid: 'test-puuid-2',
        match: { info: { gameDuration: 2100, participants: [] } },
      },
    ]

    const mockMatchInsights = [
      {
        title: 'Test Insight 1',
        joke: 'Test joke 1',
        severity: 'Medium',
      },
      {
        title: 'Test Insight 2',
        joke: 'Test joke 2',
        severity: 'High',
      },
    ]

    const mockAggregatedInsights = [
      {
        type: 'macro',
        severity: 'high',
        title: 'Poor lead conversion',
        description: 'You frequently lose games despite building an early advantage.',
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce(
      mockMatchParticipants
    )
    ;(analyzeMatchPerformance as jest.Mock)
      .mockReturnValueOnce([mockMatchInsights[0]])
      .mockReturnValueOnce([mockMatchInsights[1]])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([
      { match: mockMatchParticipants[0].match, insights: [mockMatchInsights[0]], puuid: 'test-puuid-1' },
      { match: mockMatchParticipants[1].match, insights: [mockMatchInsights[1]], puuid: 'test-puuid-2' },
    ])
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockAggregatedInsights)

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    expect(prisma.matchParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          summoner: {
            userId: 'user-123',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        include: {
          match: true,
        },
      })
    )

    expect(generateInsights).toHaveBeenCalledWith(mockMatchParticipants)

    const data = await response.json()
    expect(data).toEqual({
      matchInsights: mockMatchInsights,
      aggregatedInsights: mockAggregatedInsights,
    })
  })

  it('should order matches by creation date descending', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=user-456')
    await GET(request)

    expect(prisma.matchParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          createdAt: 'desc',
        },
      })
    )
  })

  it('should limit results to 20 matches', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=user-789')
    await GET(request)

    expect(prisma.matchParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 20,
      })
    )
  })

  it('should return JSON response', async () => {
    const mockAggregatedInsights = [
      {
        type: 'vision',
        severity: 'high',
        title: 'Low map control',
        description: 'Your vision contribution is below average.',
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockAggregatedInsights)

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    expect(response instanceof NextResponse).toBe(true)
    expect(response.headers.get('content-type')).toBe('application/json')

    const data = await response.json()
    expect(data).toEqual({
      matchInsights: [],
      aggregatedInsights: mockAggregatedInsights,
    })
  })

  it('should handle empty match history', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=new-user')
    const response = await GET(request)

    const data = await response.json()
    expect(data).toEqual({
      matchInsights: [],
      aggregatedInsights: [],
    })
  })

  it('should pass correct userId from query params', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=specific-user-id')
    await GET(request)

    expect(prisma.matchParticipant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          summoner: {
            userId: 'specific-user-id',
          },
        },
      })
    )
  })

  it('should call deduplicateAndAdaptJokes to adapt duplicate jokes', async () => {
    const mockMatchParticipants = [
      {
        puuid: 'test-puuid-1',
        match: { info: { gameDuration: 1800, participants: [] } },
      },
    ]

    const mockMatchInsights = [
      {
        title: 'Test Insight',
        joke: 'Adapted joke 1',
        severity: 'Medium',
        isAdapted: true,
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce(
      mockMatchParticipants
    )
    ;(analyzeMatchPerformance as jest.Mock).mockReturnValueOnce([
      { title: 'Test Insight', joke: 'Original joke', severity: 'Medium' },
    ])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([
      { match: mockMatchParticipants[0].match, insights: [mockMatchInsights[0]], puuid: 'test-puuid-1' },
    ])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    expect(deduplicateAndAdaptJokes).toHaveBeenCalled()

    const data = await response.json()
    expect(data.matchInsights[0].isAdapted).toBe(true)
  })

  it('should handle multiple insights', async () => {
    const mockMatchParticipants = Array(20).fill({
      puuid: 'test-puuid',
      match: { info: { gameDuration: 1800, participants: [] } },
    })

    const mockMatchInsights = [
      { type: 'macro', severity: 'high', title: 'Poor lead conversion' },
      { type: 'discipline', severity: 'medium', title: 'Overaggression detected' },
      { type: 'vision', severity: 'high', title: 'Low map control' },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce(
      mockMatchParticipants
    )
    ;(analyzeMatchPerformance as jest.Mock).mockReturnValue([])
    ;(deduplicateAndAdaptJokes as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockMatchInsights)

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    const data = await response.json()
    expect(data.aggregatedInsights.length).toBe(3)
    expect(data.aggregatedInsights).toEqual(mockMatchInsights)
  })
})
