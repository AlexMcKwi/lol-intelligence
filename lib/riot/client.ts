const RIOT_API = "https://europe.api.riotgames.com"

export async function riotFetch(path: string) {
  const response = await fetch(`${RIOT_API}${path}`, {
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY!
    },
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error("Riot API Error")
  }

  return response.json()
}