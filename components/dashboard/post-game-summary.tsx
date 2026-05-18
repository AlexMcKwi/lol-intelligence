"use client"

import { useState, useEffect } from "react"
import { InsightPanel } from "@/components/dashboard/insight-panel"
import { RecentMatches } from "@/components/dashboard/recent-matches"
import { useInsights } from "@/hooks/useInsights"

interface PostGameSummaryProps {
  userId: string | null
}

export function PostGameSummary({ userId }: PostGameSummaryProps) {
  const { insights, aggregatedInsights, funnyStory, loading, error } = useInsights(userId)
  const [recentMatches, setRecentMatches] = useState<any[]>([])

  useEffect(() => {
    // Transform insights to match format for RecentMatches component
    if (insights && insights.length > 0) {
      const matches = insights.map((insight, index) => ({
        champion: insight.champion || "Unknown",
        result: insight.win ? "Win" : "Loss",
        kda: `${insight.kills || 0} / ${insight.deaths || 0} / ${insight.assists || 0}`,
        queue: insight.queue || "Ranked",
        gold: `${Math.round((insight.goldEarned || 0) / 1000)}k`,
        csPerMin: insight.csPerMin ? insight.csPerMin.toFixed(1) : "-",
        duration: insight.duration || "-",
        joke: insight.joke
      }))
      setRecentMatches(matches)
    }
  }, [insights])

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Erreur</h2>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border bg-gradient-to-r from-slate-50 to-blue-50 p-6">
        <h1 className="text-3xl font-bold text-slate-900">
          📊 Résumé Post-Game
        </h1>
        <p className="mt-2 text-slate-600">
          Voici l'analyse sarcastique de vos {insights.length} derniers matchs avec des blagues adaptées à vos stats.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Insights & Story (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <InsightPanel
            insights={insights}
            aggregatedInsights={aggregatedInsights}
            userId={userId}
            funnyStory={funnyStory}
            loading={loading}
          />
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-4">
          {/* Stats Summary */}
          <div className="rounded-3xl border bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">📈 Résumé Rapide</h3>
            
            <div className="space-y-3">
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <p className="text-xs text-slate-500 font-semibold">MATCHS ANALYSÉS</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {insights.length}
                </p>
              </div>

              {insights.length > 0 && (
                <>
                  <div className="rounded-lg bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold">BLAGUES COLLECTÉES</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {insights.filter(i => i.joke).length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold">ADAPTÉES ✨</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {insights.filter(i => i.isAdapted).length}
                    </p>
                  </div>
                </>
              )}

              {aggregatedInsights.length > 0 && (
                <div className="rounded-lg bg-red-50 p-3 border border-red-200">
                  <p className="text-xs text-red-600 font-semibold">TENDANCES PROBLÉMATIQUES</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {aggregatedInsights.length}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">💡 Conseil:</span> Plus vous jouez, plus les blagues seront adaptées à vos stats!
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">📖 Légende</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="inline-block w-6 h-6 bg-red-100 rounded text-center leading-6 text-xs font-bold text-red-700">H</span>
                <div>
                  <p className="font-medium text-slate-900">High</p>
                  <p className="text-slate-600">Problème majeur à corriger</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="inline-block w-6 h-6 bg-yellow-100 rounded text-center leading-6 text-xs font-bold text-yellow-700">M</span>
                <div>
                  <p className="font-medium text-slate-900">Medium</p>
                  <p className="text-slate-600">Domaine d'amélioration</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="inline-block w-6 h-6 bg-green-100 rounded text-center leading-6 text-xs font-bold text-green-700">L</span>
                <div>
                  <p className="font-medium text-slate-900">Low</p>
                  <p className="text-slate-600">Détail mineur</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="inline-block text-lg">✨</span>
                <div>
                  <p className="font-medium text-slate-900">Adaptée</p>
                  <p className="text-slate-600">Personnalisée via IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <RecentMatches matches={recentMatches} loading={loading} />
    </div>
  )
}
