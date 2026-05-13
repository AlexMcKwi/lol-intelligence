import { riotFetch } from "./client"

export async function getMatchIds(puuid: string) {
  return riotFetch(
    `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`
  )
}

export async function getMatch(matchId: string) {
  return riotFetch(`/lol/match/v5/matches/${matchId}`)
}