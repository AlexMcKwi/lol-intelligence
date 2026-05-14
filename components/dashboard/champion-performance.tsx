const champions = [
  { name: "Lee Sin", games: 24, winRate: 62, kda: "4.9" },
  { name: "Kai'Sa", games: 18, winRate: 56, kda: "4.1" },
  { name: "Thresh", games: 14, winRate: 64, kda: "5.3" }
]

export function ChampionPerformance() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Champion Performance</h2>
        <p className="text-sm text-muted-foreground">
          Your strongest champions and their recent win rates.
        </p>
      </div>

      <div className="space-y-4">
        {champions.map((champion) => (
          <div key={champion.name} className="rounded-3xl border bg-background p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{champion.name}</p>
                <p className="text-sm text-muted-foreground">{champion.games} games played</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{champion.winRate}%</p>
                <p className="text-sm text-muted-foreground">Win rate</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Average KDA: {champion.kda}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
