export function parseParticipant(match: any, puuid: string) {
  const participant = match.info.participants.find(
    (p: any) => p.puuid === puuid
  )

  return {
    championName: participant.championName,
    role: participant.teamPosition,
    win: participant.win,

    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,

    csPerMinute:
      (participant.totalMinionsKilled / match.info.gameDuration) * 60,

    visionScore: participant.visionScore,
    goldEarned: participant.goldEarned,
    damageDealt: participant.totalDamageDealtToChampions,

    goldDiffAt15: participant.challenges?.goldPerMinute,
    deathsBeforeObj: participant.challenges?.deathsByEnemyChamps
  }
}