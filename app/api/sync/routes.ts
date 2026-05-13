import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getMatchIds, getMatch } from "@/lib/riot/matches"
import { parseParticipant } from "@/lib/riot/parser"

export async function POST(req: Request) {
  const body = await req.json()

  const { puuid, summonerId } = body

  const matchIds = await getMatchIds(puuid)

  for (const matchId of matchIds) {
    const match = await getMatch(matchId)

    const parsed = parseParticipant(match, puuid)

    await prisma.match.upsert({
      where: { id: matchId },
      update: {},
      create: {
        id: matchId,
        queueId: match.info.queueId,
        gameDuration: match.info.gameDuration,
        gameCreation: BigInt(match.info.gameCreation)
      }
    })

    await prisma.matchParticipant.create({
      data: {
        matchId,
        summonerId,
        ...parsed
      }
    })
  }

  return NextResponse.json({ success: true })
}