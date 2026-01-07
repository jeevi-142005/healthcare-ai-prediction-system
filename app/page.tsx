import { Suspense } from "react"
import { ResourceAllocationChart } from "@/components/charts/resource-allocation-chart"
import DashboardAI from "@/components/dashboard-ai"

export default function Page() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-balance">AI-Enhanced Healthcare Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor triage, resources, and staffing. Get predictive insights and suggestions.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<div className="text-muted-foreground">Loading chart…</div>}>
          <ResourceAllocationChart />
        </Suspense>
        <DashboardAI />
      </section>
    </div>
  )
}
