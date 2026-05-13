import { prisma } from "@/lib/prisma"
import { generateInsights } from "@/lib/insights/engine"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")!

  const matches = await prisma.matchParticipant.findMany({
    where: {
      summoner: {
        userId
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 20
  })

  const insights = generateInsights(matches)

  return NextResponse.json(insights)
}