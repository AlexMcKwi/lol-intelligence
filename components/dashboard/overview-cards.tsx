import StatsCard from "./stats-card"

const stats = [
  { title: "Win Rate", value: "58%", description: "Above average performance" },
  { title: "Average KDA", value: "4.5", description: "Solid teamfighting impact" },
  { title: "Vision Score", value: "18.3", description: "Good map control" },
  { title: "Gold Difference", value: "+1.2k", description: "Strong early pressure" }
]

export default function OverviewCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
