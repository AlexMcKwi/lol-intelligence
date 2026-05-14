const trend = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 69 },
  { label: "Fri", value: 63 },
  { label: "Sat", value: 78 },
  { label: "Sun", value: 72 }
]

export function PerformanceTrend() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Performance Trend</h2>
        <p className="text-sm text-muted-foreground">
          Track your recent improvement trajectory.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">Peak Score</p>
            <p className="mt-2 text-2xl font-semibold">78</p>
          </div>
          <div className="rounded-3xl bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">Average Form</p>
            <p className="mt-2 text-2xl font-semibold">60</p>
          </div>
          <div className="rounded-3xl bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">Consistency</p>
            <p className="mt-2 text-2xl font-semibold">92%</p>
          </div>
        </div>

        <div className="space-y-3">
          {trend.map((point) => (
            <div key={point.label} className="flex items-center gap-4">
              <span className="w-12 text-sm text-muted-foreground">{point.label}</span>
              <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${point.value}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-medium">{point.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
