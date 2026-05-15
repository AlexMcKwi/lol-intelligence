import { NextResponse } from "next/server"
import { getMatch, getMatchTimeline } from "@/lib/riot/matches"
import { analyzeMatchPerformance, getMatchSummary } from "@/lib/riot/insights"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const matchId = searchParams.get("matchId")
  const puuid = searchParams.get("puuid")

  if (!matchId || !puuid) {
    return NextResponse.json(
      { error: "matchId and puuid are required" },
      { status: 400 }
    )
  }

  try {
    const match = await getMatch(matchId)
    const timeline = await getMatchTimeline(matchId)

    const summary = getMatchSummary(match, puuid)
    const insights = analyzeMatchPerformance(match, puuid)

    return NextResponse.json({
      match: {
        id: matchId,
        summary,
        insights,
        fullData: {
          info: match.info,
          timeline: timeline.info
        }
      }
    })
  } catch (error) {
    console.error("Error fetching match details:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Failed to fetch match details: ${errorMessage}` },
      { status: 500 }
    )
  }
}
