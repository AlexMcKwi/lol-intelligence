import { generatePostGameSummary } from '@/lib/openai/generateSummary'
import OpenAI from 'openai'

// Mock the OpenAI module
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }))
})

describe('generatePostGameSummary', () => {
  let mockOpenAI: any
  let mockChatCreate: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockOpenAI = new OpenAI()
    mockChatCreate = mockOpenAI.chat.completions.create
  })

  it('should generate a summary for a winning game', async () => {
    const mockSummary =
      '✓ Strong lane phase control\n⚠ Low vision score in late game\n→ Focus on placing wards before objectives'

    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: mockSummary,
          },
        },
      ],
    })

    const gameData = {
      championName: 'Jinx',
      kills: 12,
      deaths: 3,
      assists: 8,
      visionScore: 24,
      win: true,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBe(mockSummary)
    expect(mockChatCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4.1-mini',
      })
    )
  })

  it('should generate a summary for a losing game', async () => {
    const mockSummary =
      '✓ Good KDA despite loss\n⚠ Failed teamfight coordination\n→ Practice positioning in 5v5 scenarios'

    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: mockSummary,
          },
        },
      ],
    })

    const gameData = {
      championName: 'Caitlyn',
      kills: 8,
      deaths: 5,
      assists: 10,
      visionScore: 18,
      win: false,
    }

    const result = await generatePostGameSummary(gameData)

    expect(result).toBe(mockSummary)
  })

  it('should include champion name in the prompt', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameData = {
      championName: 'Ezreal',
      kills: 5,
      deaths: 7,
      assists: 3,
      visionScore: 12,
      win: false,
    }

    await generatePostGameSummary(gameData)

    const callArgs = mockChatCreate.mock.calls[0][0]
    const promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('Ezreal')
  })

  it('should include KDA stats in the prompt', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameData = {
      championName: 'Jinx',
      kills: 12,
      deaths: 3,
      assists: 8,
      visionScore: 24,
      win: true,
    }

    await generatePostGameSummary(gameData)

    const callArgs = mockChatCreate.mock.calls[0][0]
    const promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('12/3/8')
  })

  it('should include vision score in the prompt', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameData = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 35,
      win: true,
    }

    await generatePostGameSummary(gameData)

    const callArgs = mockChatCreate.mock.calls[0][0]
    const promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('35')
  })

  it('should mark win result correctly in prompt', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameDataWin = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 25,
      win: true,
    }

    await generatePostGameSummary(gameDataWin)

    let callArgs = mockChatCreate.mock.calls[0][0]
    let promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('Win')

    jest.clearAllMocks()
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameDataLoss = {
      championName: 'Jinx',
      kills: 5,
      deaths: 8,
      assists: 3,
      visionScore: 10,
      win: false,
    }

    await generatePostGameSummary(gameDataLoss)

    callArgs = mockChatCreate.mock.calls[0][0]
    promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('Loss')
  })

  it('should use gpt-4.1-mini model', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameData = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 25,
      win: true,
    }

    await generatePostGameSummary(gameData)

    expect(mockChatCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4.1-mini',
      })
    )
  })

  it('should handle extreme stats', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Excellent performance',
          },
        },
      ],
    })

    const extremeGameData = {
      championName: 'Jinx',
      kills: 25,
      deaths: 0,
      assists: 15,
      visionScore: 100,
      win: true,
    }

    const result = await generatePostGameSummary(extremeGameData)

    expect(result).toBe('Excellent performance')

    const callArgs = mockChatCreate.mock.calls[0][0]
    const promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('25/0/15')
    expect(promptContent).toContain('100')
  })

  it('should handle low stats', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Need improvement',
          },
        },
      ],
    })

    const lowGameData = {
      championName: 'Caitlyn',
      kills: 0,
      deaths: 10,
      assists: 0,
      visionScore: 0,
      win: false,
    }

    const result = await generatePostGameSummary(lowGameData)

    expect(result).toBe('Need improvement')
  })

  it('should handle API errors gracefully', async () => {
    mockChatCreate.mockRejectedValueOnce(new Error('API Error'))

    const gameData = {
      championName: 'Jinx',
      kills: 10,
      deaths: 2,
      assists: 7,
      visionScore: 25,
      win: true,
    }

    await expect(generatePostGameSummary(gameData)).rejects.toThrow('API Error')
  })

  it('should format the prompt with all required elements', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'Test response',
          },
        },
      ],
    })

    const gameData = {
      championName: 'Jinx',
      kills: 12,
      deaths: 3,
      assists: 8,
      visionScore: 24,
      win: true,
    }

    await generatePostGameSummary(gameData)

    const callArgs = mockChatCreate.mock.calls[0][0]
    const promptContent = callArgs.messages[0].content

    expect(promptContent).toContain('Champion:')
    expect(promptContent).toContain('KDA:')
    expect(promptContent).toContain('Vision:')
    expect(promptContent).toContain('Result:')
    expect(promptContent).toContain('Generate:')
    expect(promptContent).toContain('positive point')
    expect(promptContent).toContain('critical mistake')
    expect(promptContent).toContain('improvement recommendation')
  })
})
