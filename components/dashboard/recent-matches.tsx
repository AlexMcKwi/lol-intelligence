const recentMatches = [
  {
    champion: "Lee Sin",
    result: "Win",
    kda: "7 / 2 / 9",
    queue: "Ranked Solo",
    gold: "13.4k"
  },
  {
    champion: "Kai'Sa",
    result: "Loss",
    kda: "4 / 6 / 5",
    queue: "Ranked Solo",
    gold: "11.8k"
  },
  {
    champion: "Thresh",
    result: "Win",
    kda: "2 / 1 / 16",
    queue: "ARAM",
    gold: "10.1k"
  }
]

export function RecentMatches() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Matches</h2>
          <p className="text-sm text-muted-foreground">
            Review your latest games and performance details.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recentMatches.map((match) => (
          <div
            key={`${match.champion}-${match.queue}-${match.result}`}
            className="rounded-3xl border bg-background p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{match.champion}</p>
                <p className="text-sm text-muted-foreground">{match.queue}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  match.result === "Win"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {match.result}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>KDA: {match.kda}</span>
              <span>Gold: {match.gold}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
