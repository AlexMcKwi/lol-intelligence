"use client"

import { useState, useEffect } from "react"

interface Insight {
  title: string
  description: string
  severity: "High" | "Medium" | "Low"
  joke: string
  type?: string
  body?: string
  isAdapted?: boolean
}

interface InsightPanelProps {
  insights?: Insight[]
  aggregatedInsights?: any[]
  userId?: string
  funnyStory?: string
  loading?: boolean
}

export function InsightPanel({ 
  insights, 
  aggregatedInsights,
  userId, 
  funnyStory, 
  loading = false 
}: InsightPanelProps) {
  const [displayedInsights, setDisplayedInsights] = useState<Insight[]>([])
  const [showStory, setShowStory] = useState(true)
  const [uniqueJokes, setUniqueJokes] = useState<string[]>([])
  const [adaptedJokes, setAdaptedJokes] = useState<Insight[]>([])
  const [expandedSection, setExpandedSection] = useState<"story" | "unique" | "all">("story")

  useEffect(() => {
    if (insights && insights.length > 0) {
      setDisplayedInsights(insights)
      
      // Collecter les jokes uniques (insensible à la casse)
      const jokeMap = new Map<string, string>()
      insights
        .filter(i => i.joke && i.joke.trim().length > 0)
        .forEach(i => {
          const normalized = i.joke.toLowerCase().trim()
          if (!jokeMap.has(normalized)) {
            jokeMap.set(normalized, i.joke)
          }
        })
      
      setUniqueJokes(Array.from(jokeMap.values()))
      
      // Collecter les blagues adaptées
      const adapted = insights.filter(i => i.isAdapted && i.joke && i.joke.trim().length > 0)
      setAdaptedJokes(adapted)
    }
  }, [insights])

  if (loading) {
    return (
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Insights en cours de chargement...</h2>
      </div>
    )
  }

  const displayInsights = displayedInsights.length > 0 ? displayedInsights : getDefaultInsights()
  const jokeCount = displayInsights.filter(i => i.joke).length

  return (
    <div className="space-y-6">
      {/* Section Histoire Rigolote */}
      {funnyStory && (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-950">
              <span className="text-2xl">🎭</span>
              La Saga de votre Performance
            </h2>
            <button
              onClick={() => setShowStory(!showStory)}
              className="text-xs font-medium text-amber-700 hover:text-amber-900 transition"
            >
              {showStory ? "📖 Lire moins" : "📖 Lire plus"}
            </button>
          </div>
          {showStory && (
            <div className="text-amber-950">
              <p className="whitespace-pre-wrap leading-relaxed text-sm">
                {funnyStory}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section Statistiques des Jokes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-blue-50 p-4">
          <p className="text-xs text-blue-600 font-semibold">BLAGUES COLLECTÉES</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">{jokeCount}</p>
          <p className="mt-1 text-xs text-blue-600">Insights avec blagues</p>
        </div>
        <div className="rounded-2xl border bg-purple-50 p-4">
          <p className="text-xs text-purple-600 font-semibold">BLAGUES UNIQUES</p>
          <p className="mt-2 text-2xl font-bold text-purple-900">{uniqueJokes.length}</p>
          <p className="mt-1 text-xs text-purple-600">Sans doublons</p>
        </div>
        <div className="rounded-2xl border bg-green-50 p-4">
          <p className="text-xs text-green-600 font-semibold">ADAPTÉES ✨</p>
          <p className="mt-2 text-2xl font-bold text-green-700">{adaptedJokes.length}</p>
          <p className="mt-1 text-xs text-green-600">Par IA</p>
        </div>
      </div>

      {/* Section Blagues Uniques */}
      {uniqueJokes.length > 0 && (
        <div className="rounded-3xl border bg-gradient-to-br from-violet-50 to-purple-50 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-violet-950">
              <span className="text-lg">✨</span>
              Blagues Uniques ({uniqueJokes.length})
            </h3>
            <button
              onClick={() => setExpandedSection(expandedSection === "unique" ? "all" : "unique")}
              className="text-xs font-medium text-violet-700 hover:text-violet-900 transition"
            >
              {expandedSection === "unique" ? "Replier" : "Déplier"}
            </button>
          </div>
          {expandedSection === "unique" && (
            <div className="space-y-2">
              {uniqueJokes.map((joke, index) => {
                const insightForJoke = displayInsights.find(i => 
                  i.joke.toLowerCase().trim() === joke.toLowerCase().trim()
                )
                return (
                  <div
                    key={`unique-joke-${index}`}
                    className="rounded-lg border border-violet-200 bg-white p-3 hover:bg-violet-50 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm italic text-violet-950">
                          "{joke}"
                        </p>
                        {insightForJoke && (
                          <p className="text-xs text-violet-600 mt-1">
                            → {insightForJoke.title}
                          </p>
                        )}
                      </div>
                      {insightForJoke?.isAdapted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                          ✨ Adaptée
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Section Tous les Insights avec Jokes */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Analyse Complète</h2>
            <p className="text-sm text-muted-foreground">
              {jokeCount} blagues sur {displayInsights.length} insights
            </p>
          </div>
          <button
            onClick={() => setExpandedSection(expandedSection === "all" ? "story" : "all")}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            {expandedSection === "all" ? "Replier" : "Déplier tous"}
          </button>
        </div>

        <div className="space-y-2">
          {displayInsights.map((insight, index) => (
            <details
              key={`${insight.title}-${index}`}
              className="group rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
              open={expandedSection === "all"}
            >
              <summary className="cursor-pointer select-none p-4 flex items-start justify-between gap-3 hover:bg-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{insight.title}</span>
                    {insight.isAdapted && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <span>✨</span>
                        <span>Adaptée</span>
                      </span>
                    )}
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                  insight.severity === "High" 
                    ? "bg-red-100 text-red-700"
                    : insight.severity === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {insight.severity}
                </span>
              </summary>
              
              <div className="px-4 pb-4 border-t border-slate-200 bg-white rounded-b-lg">
                <p className="text-sm text-slate-600 mb-4">
                  {insight.description}
                </p>
                
                {insight.joke && (
                  <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 mb-3">
                    <p className="text-xs font-semibold text-amber-700 mb-2">💭 BLAGUE</p>
                    <p className="text-sm italic text-amber-950 leading-relaxed">
                      "{insight.joke}"
                    </p>
                  </div>
                )}

                {insight.body && (
                  <div className="mt-3 text-xs text-slate-500 p-3 bg-slate-100 rounded">
                    {insight.body}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Section Insights Agrégés */}
      {aggregatedInsights && aggregatedInsights.length > 0 && (
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-indigo-900">📊 Tendances Globales</h3>
          <div className="space-y-2">
            {aggregatedInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                <div className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                  insight.severity === "high" 
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {insight.severity}
                </div>
                <div>
                  <p className="font-medium text-indigo-900">{insight.title}</p>
                  <p className="text-xs text-indigo-700 mt-1">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Fallback: Default insights with jokes
function getDefaultInsights(): Insight[] {
  return [
    {
      title: "Mauvaise conversion d'avantage",
      description: "Vous perdez fréquemment des parties malgré un avantage obtenu en début de jeu.",
      severity: "High",
      joke: "Vous traitez votre avance en gold comme une offre à durée limitée."
    },
    {
      title: "Suragressivité détectée",
      description: "Votre nombre de morts réduit régulièrement votre impact en milieu de partie.",
      severity: "Medium",
      joke: "L'équipe ennemie apprécie vos donations."
    },
    {
      title: "Faible contrôle de carte",
      description: "Votre contribution à la vision est inférieure à la moyenne pour votre rôle.",
      severity: "High",
      joke: "Votre minimap semble purement décorative."
    }
  ]
}
