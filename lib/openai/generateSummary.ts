import OpenAI from "openai"

declare const process: { env: { OPENAI_API_KEY?: string } }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generatePostGameSummary(data: any) {
  const prompt = `
  Analyze this League of Legends performance.

  Champion: ${data.championName}
  KDA: ${data.kills}/${data.deaths}/${data.assists}
  Vision: ${data.visionScore}
  Result: ${data.win ? "Win" : "Loss"}

  Generate:
  - one positive point
  - one critical mistake
  - one improvement recommendation
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return response.choices[0].message.content
}