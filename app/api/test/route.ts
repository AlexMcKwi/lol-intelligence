export async function GET() {
  const response = await fetch(
    "https://europe.api.riotgames.com/lol/status/v4/platform-data",
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY!
      }
    }
  )

  const data = await response.json()

  return Response.json(data)
}