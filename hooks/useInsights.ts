import { useState, useEffect } from "react"
import { generateFunnyPerformanceStory } from "@/lib/openai/generateSummary"

interface UseInsightsResult {
  insights: any[]
  aggregatedInsights: any[]
  funnyStory: string | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useInsights(userId: string | null): UseInsightsResult {
  const [insights, setInsights] = useState<any[]>([])
  const [aggregatedInsights, setAggregatedInsights] = useState<any[]>([])
  const [funnyStory, setFunnyStory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    if (!userId) {
      setError("User ID not provided")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch insights from API
      const response = await fetch(`/api/insights?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch insights")
      }

      const data = await response.json()
      
      setInsights(data.matchInsights || [])
      setAggregatedInsights(data.aggregatedInsights || [])

      // Generate funny story based on insights
      if (data.matchInsights && data.matchInsights.length > 0) {
        try {
          const story = await generateFunnyPerformanceStory({
            matchInsights: data.matchInsights,
            aggregatedInsights: data.aggregatedInsights
          })
          setFunnyStory(story)
        } catch (storyError) {
          console.error("Failed to generate funny story:", storyError)
          setFunnyStory(null)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("Error fetching insights:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [userId])

  return {
    insights,
    aggregatedInsights,
    funnyStory,
    loading,
    error,
    refetch: fetchInsights
  }
}
