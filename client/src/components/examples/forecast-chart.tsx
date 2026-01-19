import { ForecastChart } from '../forecast-chart'

export default function ForecastChartExample() {
  const data = [
    { date: 'Mon', actual: 65, predicted: 62 },
    { date: 'Tue', actual: 72, predicted: 70 },
    { date: 'Wed', actual: 68, predicted: 68 },
    { date: 'Thu', actual: 85, predicted: 78 },
    { date: 'Fri', predicted: 82 },
    { date: 'Sat', predicted: 75 },
    { date: 'Sun', predicted: 70 },
  ]

  return (
    <div className="w-full">
      <ForecastChart title="Patient Inflow Forecast" data={data} />
    </div>
  )
}
