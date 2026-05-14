import { generateInsights } from '@/lib/insights/engine'

describe('generateInsights', () => {
  describe('Poor lead conversion', () => {
    it('should detect poor lead conversion when 3+ games have early gold advantage but end in loss', () => {
      const matches = [
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
        {
          goldDiffAt15: 2100,
          win: false,
          deaths: 4,
          visionScore: 12,
        },
      ]

      const insights = generateInsights(matches)
      const poorLeadInsight = insights.find((i) => i.type === 'macro')

      expect(poorLeadInsight).toBeDefined()
      expect(poorLeadInsight?.severity).toBe('high')
      expect(poorLeadInsight?.title).toBe('Poor lead conversion')
    })

    it('should not detect poor lead conversion when less than 3 games meet criteria', () => {
      const matches = [
        {
          goldDiffAt15: 3000,
          win: false,
          deaths: 3,
          visionScore: 15,
        },
        {
          goldDiffAt15: 2500,
          win: true,
          deaths: 2,
          visionScore: 14,
        },
      ]

      const insights = generateInsights(matches)
      const poorLeadInsight = insights.find((i) => i.type === 'macro')

      expect(poorLeadInsight).toBeUndefined()
    })

    it('should not detect poor lead conversion when games with lead are won', () => {
      const matches = [
        {
          goldDiffAt15: 3000,
          win: true,
          deaths: 1,
          visionScore: 20,
        },
        {
          goldDiffAt15: 2500,
          win: true,
          deaths: 2,
          visionScore: 18,
        },
      ]

      const insights = generateInsights(matches)
      const poorLeadInsight = insights.find((i) => i.type === 'macro')

      expect(poorLeadInsight).toBeUndefined()
    })
  })

  describe('Overaggression detection', () => {
    it('should detect overaggression when 5+ games have 8+ deaths', () => {
      const matches = [
        {
          goldDiffAt15: 1000,
          win: false,
          deaths: 8,
          visionScore: 10,
        },
        {
          goldDiffAt15: 1200,
          win: true,
          deaths: 9,
          visionScore: 12,
        },
        {
          goldDiffAt15: 500,
          win: false,
          deaths: 8,
          visionScore: 8,
        },
        {
          goldDiffAt15: 800,
          win: false,
          deaths: 10,
          visionScore: 11,
        },
        {
          goldDiffAt15: 1100,
          win: true,
          deaths: 8,
          visionScore: 9,
        },
      ]

      const insights = generateInsights(matches)
      const aggressionInsight = insights.find((i) => i.type === 'discipline')

      expect(aggressionInsight).toBeDefined()
      expect(aggressionInsight?.severity).toBe('medium')
      expect(aggressionInsight?.title).toBe('Overaggression detected')
    })

    it('should not detect overaggression when less than 5 games have high deaths', () => {
      const matches = [
        {
          goldDiffAt15: 1000,
          win: false,
          deaths: 8,
          visionScore: 10,
        },
        {
          goldDiffAt15: 1200,
          win: true,
          deaths: 4,
          visionScore: 12,
        },
      ]

      const insights = generateInsights(matches)
      const aggressionInsight = insights.find((i) => i.type === 'discipline')

      expect(aggressionInsight).toBeUndefined()
    })
  })

  describe('Low map control detection', () => {
    it('should detect low map control when 5+ games have vision score <= 10', () => {
      const matches = [
        {
          goldDiffAt15: 1000,
          win: false,
          deaths: 3,
          visionScore: 8,
        },
        {
          goldDiffAt15: 1200,
          win: true,
          deaths: 2,
          visionScore: 9,
        },
        {
          goldDiffAt15: 500,
          win: false,
          deaths: 4,
          visionScore: 10,
        },
        {
          goldDiffAt15: 800,
          win: false,
          deaths: 3,
          visionScore: 7,
        },
        {
          goldDiffAt15: 1100,
          win: true,
          deaths: 2,
          visionScore: 10,
        },
      ]

      const insights = generateInsights(matches)
      const visionInsight = insights.find((i) => i.type === 'vision')

      expect(visionInsight).toBeDefined()
      expect(visionInsight?.severity).toBe('high')
      expect(visionInsight?.title).toBe('Low map control')
    })

    it('should not detect low map control when vision scores are above threshold', () => {
      const matches = [
        {
          goldDiffAt15: 1000,
          win: false,
          deaths: 3,
          visionScore: 15,
        },
        {
          goldDiffAt15: 1200,
          win: true,
          deaths: 2,
          visionScore: 18,
        },
      ]

      const insights = generateInsights(matches)
      const visionInsight = insights.find((i) => i.type === 'vision')

      expect(visionInsight).toBeUndefined()
    })
  })

  describe('Multiple insights', () => {
    it('should return multiple insights when multiple conditions are met', () => {
      const matches = Array(5)
        .fill(null)
        .map((_, i) => ({
          goldDiffAt15: 3000 - i * 100,
          win: false,
          deaths: 8 + i,
          visionScore: 8 - (i % 3),
        }))

      const insights = generateInsights(matches)

      expect(insights.length).toBeGreaterThanOrEqual(3)
      expect(insights.some((i) => i.type === 'macro')).toBe(true)
      expect(insights.some((i) => i.type === 'discipline')).toBe(true)
      expect(insights.some((i) => i.type === 'vision')).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty match array', () => {
      const insights = generateInsights([])
      expect(insights).toEqual([])
    })

    it('should handle matches with missing fields gracefully', () => {
      const matches = [
        { goldDiffAt15: 3000 },
        { deaths: 8 },
        { visionScore: 5 },
      ]

      // Should not throw
      expect(() => generateInsights(matches as any)).not.toThrow()
    })
  })
})
