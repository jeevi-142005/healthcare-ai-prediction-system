"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card } from "@/components/ui/card"

type StaffResponse = { shifts: string[] }

export default function StaffPage() {
  const { data, error, isLoading } = useSWR<StaffResponse>("/api/staff", fetcher, { refreshInterval: 15000 })
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Staff Scheduling</h1>
        <p className="text-muted-foreground">Optimal coverage suggestions with minimized overwork.</p>
      </section>
      <Card className="p-4">
        <h2 className="mb-2 text-lg font-medium">Suggested Coverage</h2>
        {error && <p className="text-destructive">Failed to load schedule.</p>}
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        <ul className="list-inside list-disc">
          {data?.shifts.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
