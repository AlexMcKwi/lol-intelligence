import { Flame } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between rounded-3xl border bg-card p-6 shadow-sm">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Flame className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            Competitive Intelligence
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, Summoner
        </h1>

        <p className="mt-2 text-muted-foreground">
          Analyze your performance and identify improvement opportunities.
        </p>
      </div>
    </div>
  )
}