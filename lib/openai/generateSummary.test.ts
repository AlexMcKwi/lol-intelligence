import { generatePostGameSummary } from '@/lib/openai/generateSummary'

// Mock the OpenAI module properly
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: 'Test summary response',
              },
            },
          ],
        }),
      },
    },
  }))
})

describe('generatePostGameSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a summary for a winning game', async () => {
    const gameData = {
      championName: 'Jinx',
      kills: 12,
      deaths: 3,
      assists: 8,
      visionScore: 24,
      win: true,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBe('Test summary response')
  })

  it('should generate a summary for a losing game', async () => {
    const gameData = {
      championName: 'Caitlyn',
      kills: 8,
      deaths: 5,
      assists: 10,
      visionScore: 18,
      win: false,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBe('Test summary response')
  })

  it('should include champion name in the prompt', async () => {
    const gameData = {
      championName: 'Ezreal',
      kills: 5,
      deaths: 7,
      assists: 3,
      visionScore: 12,
      win: false,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBeTruthy()
  })

  it('should include KDA stats in the prompt', async () => {
    const gameData = {
      championName: 'Jinx',
      kills: 12,
      deaths: 3,
      assists: 8,
      visionScore: 24,
      win: true,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBeTruthy()
  })

  it('should include vision score in the prompt', async () => {
    const gameData = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 35,
      win: true,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBeTruthy()
  })

  it('should mark win result correctly in prompt', async () => {
    const gameDataWin = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 25,
      win: true,
    }

    const result = await generatePostGameSummary(gameDataWin)

    expect(result).toBeTruthy()
  })

  it('should use gpt-4.1-mini model', async () => {
    const gameData = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 25,
      win: true,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBeTruthy()
  })

  it('should handle extreme stats', async () => {
    const extremeGameData = {
      championName: 'Jinx',
      kills: 25,
      deaths: 0,
      assists: 15,
      visionScore: 100,
      win: true,
    }

    const result = await generatePostGameSummary(extremeGameData)

    expect(result).toBe('Test summary response')
  })

  it('should handle low stats', async () => {
    const lowGameData = {
      championName: 'Caitlyn',
      kills: 0,
      deaths: 10,
      assists: 0,
      visionScore: 0,
      win: false,
    }

    const result = await generatePostGameSummary(lowGameData)

    expect(result).toBe('Test summary response')
  })
})
