import { riotFetch } from "./client"

const RIOT_API = "https://europe.api.riotgames.com/"

export async function getMatchIds(puuid: string) {
  return riotFetch(
    `lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`,
    RIOT_API
  )
}

export async function getMatch(matchId: string) {
  return riotFetch(`lol/match/v5/matches/${matchId}`, RIOT_API)
}