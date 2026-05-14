const insights = [
  {
    title: "Poor lead conversion",
    description: "You frequently lose games despite building an early advantage.",
    severity: "High"
  },
  {
    title: "Overaggression detected",
    description: "Your death count is consistently reducing your mid-game impact.",
    severity: "Medium"
  },
  {
    title: "Low map control",
    description: "Your vision contribution is below average for your role.",
    severity: "High"
  }
]

export function InsightPanel() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Insights</h2>
        <p className="text-sm text-muted-foreground">
          Actionable recommendations based on recent match performance.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-3xl border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{insight.title}</h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {insight.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
