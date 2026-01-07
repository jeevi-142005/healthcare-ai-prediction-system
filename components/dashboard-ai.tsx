"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type AiResult = {
  triage: string[]
  staff: string[]
  resources: Record<string, number>
}

export default function DashboardAI() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request:
            "Generate today’s patient triage list, predict ICU bed usage, and suggest staff allocation for the emergency department.",
        }),
      })
      if (!res.ok) throw new Error("AI request failed")
      const data = (await res.json()) as AiResult
      setResult(data)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">AI Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Get prioritized triage, resource predictions, and staffing guidance.
        </p>
      </div>
      <div className="mt-auto">
        <Button onClick={handleGenerate} disabled={loading} className="bg-primary text-primary-foreground">
          {loading ? "Generating…" : "Generate Suggestions"}
        </Button>
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {result && (
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <h4 className="font-medium">Priority Queue (Triage)</h4>
            <ul className="list-inside list-disc text-pretty">
              {result.triage.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Staff Schedule Suggestion</h4>
            <ul className="list-inside list-disc text-pretty">
              {result.staff.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Predicted Resource Needs</h4>
            <ul className="list-inside list-disc text-pretty">
              {Object.entries(result.resources).map(([k, v]) => (
                <li key={k}>
                  {k}: {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  )
}
