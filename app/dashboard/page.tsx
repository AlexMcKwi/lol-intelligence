import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-4 p-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold">Performance Overview</h2>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Recent Insights</h2>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Champion Statistics</h2>
      </Card>
    </div>
  )
}