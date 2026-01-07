"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

type ResourceDatum = { name: string; available: number; inUse: number }
type ResourceResponse = { resources: ResourceDatum[]; shortages: string[] }

export function ResourceAllocationChart() {
  const { data, error, isLoading } = useSWR<ResourceResponse>("/api/resources", fetcher, {
    refreshInterval: 10_000,
  })

  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-balance">Hospital Resource Allocation</h3>
        <p className="text-sm text-muted-foreground">Real-time status of key resources</p>
      </div>
      {error && <p className="text-destructive">Failed to load resources.</p>}
      {isLoading && <p className="text-muted-foreground">Loading...</p>}
      {data && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.resources}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="available" fill="oklch(var(--color-chart-3))" />
              <Bar dataKey="inUse" fill="oklch(var(--color-chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {data?.shortages?.length ? (
        <div className="mt-3 rounded-md border border-border bg-muted p-2 text-sm">
          <strong>Alerts:</strong> {data.shortages.map((s) => s).join(", ")}
        </div>
      ) : null}
    </Card>
  )
}
