interface StatsCardProps {
  title: string
  value: string
  description: string
}

export default function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
