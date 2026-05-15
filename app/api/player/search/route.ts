import { NextResponse } from "next/server"
import { getAccountByGameName, getSummonerByPuuid } from "@/lib/riot/client"
import { getMatchIds, getMatch } from "@/lib/riot/matches"
import { parseParticipant } from "@/lib/riot/parser"
import { getMainInsightJoke } from "@/lib/riot/insights"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const gameName = searchParams.get("gameName")
  const tagLine = searchParams.get("tagLine")

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "gameName and tagLine are required" },
      { status: 400 }
    )
  }

  try {
    console.log(`Searching for player: ${gameName}#${tagLine}`)

    // Get account by game name and tag
    const account = await getAccountByGameName(gameName, tagLine)
    console.log("Account found:", account)

    // Get summoner info
    const summoner = await getSummonerByPuuid(account.puuid)
    console.log("Summoner found:", summoner)

    // Get match IDs
    const matchIds = await getMatchIds(account.puuid)
    console.log(`Found ${matchIds.length} matches`)

    // Get detailed match data
    const matches = await Promise.all(
      matchIds.slice(0, 20).map(async (matchId: string) => {
        try {
          const match = await getMatch(matchId)
          const parsed = parseParticipant(match, account.puuid)
          const joke = getMainInsightJoke(match, account.puuid)
          
          return {
            id: matchId,
            ...parsed,
            timestamp: match.info.gameCreation,
            duration: match.info.gameDuration,
            joke
          }
        } catch (error) {
          console.error(`Error parsing match ${matchId}:`, error)
          return null
        }
      })
    )

    const validMatches = matches.filter(m => m !== null)

    return NextResponse.json({
      player: {
        puuid: account.puuid,
        summonerId: summoner.id,
        name: `${account.gameName}#${account.tagLine}`,
        level: summoner.summonerLevel
      },
      matches: validMatches
    })
  } catch (error) {
    console.error("Error searching player:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Player not found or API error: ${errorMessage}` },
      { status: 404 }
    )
  }
}
