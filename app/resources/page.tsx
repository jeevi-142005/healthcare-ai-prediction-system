import { ResourceAllocationChart } from "@/components/charts/resource-allocation-chart"

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Resources</h1>
        <p className="text-muted-foreground">Beds, ICU capacity, and equipment status in real-time.</p>
      </section>
      <ResourceAllocationChart />
    </div>
  )
}
