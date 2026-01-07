"use client"

import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Patient = {
  id: string
  name: string
  severity: "Critical" | "High" | "Medium" | "Low"
  waitMin: number
}

type TriageData = { patients: Patient[] }

export default function TriagePage() {
  const { data, error, isLoading } = useSWR<TriageData>("/api/triage", fetcher, { refreshInterval: 8000 })
  const [name, setName] = useState("")
  const [severity, setSeverity] = useState<Patient["severity"]>("Medium")
  const [waitMin, setWaitMin] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)

  async function addPatient() {
    setSubmitting(true)
    try {
      await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, severity, waitMin }),
      })
      setName("")
      setSeverity("Medium")
      setWaitMin(0)
      mutate("/api/triage")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Patient Triage</h1>
        <p className="text-muted-foreground">Priority queue based on severity and wait time.</p>
      </section>

      <Card className="p-4">
        <h2 className="mb-3 text-lg font-medium">Add Patient</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <select
              id="severity"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Patient["severity"])}
              aria-label="Select severity"
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="wait">Wait (min)</Label>
            <Input
              id="wait"
              type="number"
              value={waitMin}
              onChange={(e) => setWaitMin(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addPatient} disabled={submitting} className="bg-primary text-primary-foreground">
              {submitting ? "Adding…" : "Add"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 text-lg font-medium">Priority Queue</h2>
        {error && <p className="text-destructive">Failed to load triage data.</p>}
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Severity</th>
                <th className="px-3 py-2 text-left font-medium">Wait (min)</th>
              </tr>
            </thead>
            <tbody>
              {data?.patients.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p.severity}</td>
                  <td className="px-3 py-2">{p.waitMin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
