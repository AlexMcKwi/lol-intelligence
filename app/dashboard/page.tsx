import React from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import OverviewCards from "@/components/dashboard/overview-cards"
import { RecentMatches } from "@/components/dashboard/recent-matches"
import { InsightPanel } from "@/components/dashboard/insight-panel"
import { ChampionPerformance } from "@/components/dashboard/champion-performance"
import { PerformanceTrend } from "@/components/dashboard/performance-trend"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <DashboardHeader />

        <OverviewCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceTrend />
          </div>

          <div>
            <InsightPanel />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChampionPerformance />
          <RecentMatches />
        </div>
      </div>
    </main>
  )
}