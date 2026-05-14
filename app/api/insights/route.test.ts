import { GET } from '@/app/api/insights/route'
import { prisma } from '@/lib/prisma'
import { generateInsights } from '@/lib/insights/engine'
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

describe('GET /api/insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return insights for a given user', async () => {
    const mockMatches = [
      {
        goldDiffAt15: 3000,
        win: false,
        deaths: 3,
        visionScore: 15,
      },
      {
        goldDiffAt15: 2500,
        win: false,
        deaths: 2,
        visionScore: 14,
      },
    ]

    const mockInsights = [
      {
        type: 'macro',
        severity: 'high',
        title: 'Poor lead conversion',
        description: 'You frequently lose games despite building an early advantage.',
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce(mockMatches)
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockInsights)

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
      })
    )

    expect(generateInsights).toHaveBeenCalledWith(mockMatches)

    const data = await response.json()
    expect(data).toEqual(mockInsights)
  })

  it('should order matches by creation date descending', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
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
    const mockInsights = [
      {
        type: 'vision',
        severity: 'high',
        title: 'Low map control',
        description: 'Your vision contribution is below average.',
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockInsights)

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    expect(response instanceof NextResponse).toBe(true)
    expect(response.headers.get('content-type')).toBe('application/json')

    const data = await response.json()
    expect(data).toEqual(mockInsights)
  })

  it('should handle empty match history', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
    ;(generateInsights as jest.Mock).mockReturnValueOnce([])

    const request = new Request('http://localhost:3000/api/insights?userId=new-user')
    const response = await GET(request)

    const data = await response.json()
    expect(data).toEqual([])
  })

  it('should pass correct userId from query params', async () => {
    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce([])
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

  it('should handle multiple insights', async () => {
    const mockMatches = Array(20).fill({
      goldDiffAt15: 1000,
      win: false,
      deaths: 8,
      visionScore: 8,
    })

    const mockInsights = [
      {
        type: 'macro',
        severity: 'high',
        title: 'Poor lead conversion',
      },
      {
        type: 'discipline',
        severity: 'medium',
        title: 'Overaggression detected',
      },
      {
        type: 'vision',
        severity: 'high',
        title: 'Low map control',
      },
    ]

    ;(prisma.matchParticipant.findMany as jest.Mock).mockResolvedValueOnce(mockMatches)
    ;(generateInsights as jest.Mock).mockReturnValueOnce(mockInsights)

    const request = new Request('http://localhost:3000/api/insights?userId=user-123')
    const response = await GET(request)

    const data = await response.json()
    expect(data.length).toBe(3)
    expect(data).toEqual(mockInsights)
  })
})
