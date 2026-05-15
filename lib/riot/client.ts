const RIOT_API = "https://europe.api.riotgames.com/"
const RIOT_ACCOUNT_API = "https://americas.api.riotgames.com/"
const SUMMONER_API = "https://euw1.api.riotgames.com/"

export async function riotFetch(path: string, region: string = RIOT_API) {
  const response = await fetch(`${region}${path}`, {
    headers: {
      "X-Riot-Token": process.env.RIOT_API_KEY!
    },
    cache: "no-store"
  })

  if (!response.ok) {
    throw new Error(`Riot API Error: ${response.status}`)
  }

  return response.json()
}

export async function getAccountByGameName(gameName: string, tagLine: string) {
  return riotFetch(
    `riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    RIOT_API
  )
}

export async function getSummonerByPuuid(puuid: string) {
  return riotFetch(`lol/summoner/v4/summoners/by-puuid/${puuid}`,SUMMONER_API)
}