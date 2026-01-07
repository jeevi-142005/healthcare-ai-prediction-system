import { Card } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground">Time series forecasting and optimization insights.</p>
      </section>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          Coming soon: ICU inflow forecasts, demand trends, and optimization outcomes.
        </p>
      </Card>
    </div>
  )
}
