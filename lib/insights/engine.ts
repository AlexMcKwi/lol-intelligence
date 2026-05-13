export function generateInsights(matches: any[]) {
  const insights = []

  const lossesAfterLead = matches.filter(
    (m) => m.goldDiffAt15 > 2000 && !m.win
  )

  if (lossesAfterLead.length >= 3) {
    insights.push({
      type: "macro",
      severity: "high",
      title: "Poor lead conversion",
      description:
        "You frequently lose games despite building an early advantage."
    })
  }

  const highDeathGames = matches.filter((m) => m.deaths >= 8)

  if (highDeathGames.length >= 5) {
    insights.push({
      type: "discipline",
      severity: "medium",
      title: "Overaggression detected",
      description:
        "Your death count is consistently reducing your mid-game impact."
    })
  }

  const lowVision = matches.filter((m) => m.visionScore <= 10)

  if (lowVision.length >= 5) {
    insights.push({
      type: "vision",
      severity: "high",
      title: "Low map control",
      description:
        "Your vision contribution is below average for your role."
    })
  }

  return insights
}