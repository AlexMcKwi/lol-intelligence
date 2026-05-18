"use client"

import { useState, useEffect } from "react"

interface Match {
  champion: string
  result: "Win" | "Loss"
  kda: string
  queue: string
  gold: string
  joke?: string
  duration?: string
  csPerMin?: string
}

interface RecentMatchesProps {
  matches?: Match[]
  loading?: boolean
}

export function RecentMatches({ matches = [], loading = false }: RecentMatchesProps) {
  const [displayedMatches, setDisplayedMatches] = useState<Match[]>([])

  useEffect(() => {
    if (matches && matches.length > 0) {
      setDisplayedMatches(matches)
    } else {
      setDisplayedMatches(getDefaultMatches())
    }
  }, [matches])

  if (loading) {
    return (
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Matchs en cours de chargement...</h2>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Derniers Matchs</h2>
          <p className="text-sm text-muted-foreground">
            Consultez vos {displayedMatches.length} dernières parties avec les blagues du moment.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {displayedMatches.map((match, index) => (
          <details
            key={`${match.champion}-${index}`}
            className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition overflow-hidden"
          >
            <summary className="cursor-pointer select-none p-4 flex items-center justify-between gap-4 hover:bg-slate-100">
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <p className="font-semibold text-slate-900">{match.champion}</p>
                  <p className="text-sm text-slate-600">{match.queue}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    match.result === "Win"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {match.result === "Win" ? "✓ Victoire" : "✗ Défaite"}
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-200 bg-white p-4 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 font-semibold">KDA</p>
                  <p className="mt-1 text-lg font-bold text-blue-900">{match.kda}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs text-purple-600 font-semibold">Gold</p>
                  <p className="mt-1 text-lg font-bold text-purple-900">{match.gold}</p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="text-xs text-indigo-600 font-semibold">CS/min</p>
                  <p className="mt-1 text-lg font-bold text-indigo-900">{match.csPerMin || "-"}</p>
                </div>
              </div>

              {match.duration && (
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Durée:</span> {match.duration}
                </p>
              )}

              {/* Joke */}
              {match.joke && (
                <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4">
                  <p className="text-xs font-semibold text-amber-700 mb-2">😂 LA BLAGUE</p>
                  <p className="text-sm italic text-amber-950 leading-relaxed">
                    "{match.joke}"
                  </p>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>

      {displayedMatches.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Conseil:</span> Ouvrez les matchs pour voir les blagues et les stats détaillées. 
            Les blagues adaptées (✨) ont été personnalisées selon vos stats!
          </p>
        </div>
      )}
    </div>
  )
}

function getDefaultMatches(): Match[] {
  return [
    {
      champion: "Lee Sin",
      result: "Win",
      kda: "7 / 2 / 9",
      queue: "Ranked Solo",
      gold: "13.4k",
      csPerMin: "6.2",
      duration: "32m 45s",
      joke: "Votre insec ressemble à une chorégraphie soigneusement planifiée aujourd'hui."
    },
    {
      champion: "Kai'Sa",
      result: "Loss",
      kda: "4 / 6 / 5",
      queue: "Ranked Solo",
      gold: "11.8k",
      csPerMin: "5.8",
      duration: "28m 12s",
      joke: "L'équipe ennemie a passé plus de temps à vous attendrequ'à vous combattre."
    },
    {
      champion: "Thresh",
      result: "Win",
      kda: "2 / 1 / 16",
      queue: "ARAM",
      gold: "10.1k",
      csPerMin: "4.5",
      duration: "25m 30s",
      joke: "Vos hooks étaient plus précises qu'une guidance de missile."
    }
  ]
}
