import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft, TrendingUp, Brain, Activity, Clock, Users, Bed } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForecastingAnalyticsProps {
  onBack: () => void;
}

export default function ForecastingAnalytics({ onBack }: ForecastingAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [forecastData, setForecastData] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateForecastData = (period: string) => {
    const getDaysCount = () => {
      switch(period) {
        case '7days': return 7;
        case '30days': return 30;
        case '90days': return 90;
        default: return 7;
      }
    };

    const generateForecastDates = (days: number) => {
      const dates = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      return dates;
    };

    const daysCount = getDaysCount();
    const forecastDates = generateForecastDates(daysCount);
    const displayCount = daysCount;
    
    const admissions = [];
    for (let i = 0; i < displayCount; i++) {
      admissions.push({
        date: forecastDates[i],
        predicted: Math.floor(Math.random() * 30 + 20),
        actual: i === 0 ? Math.floor(Math.random() * 30 + 20) : null,
        confidence: Math.random() * 0.2 + 0.8
      });
    }

    return {
      patientAdmissions: admissions,
    resourceDemand: [
      { resource: "ICU Beds", current: 18, predicted: 22, trend: "increasing" },
      { resource: "General Beds", current: 85, predicted: 95, trend: "increasing" },
      { resource: "Staff", current: 45, predicted: 52, trend: "increasing" },
      { resource: "Ambulances", current: 3, predicted: 5, trend: "stable" }
    ],
    departmentLoad: [
      { department: "Emergency", current: 75, predicted: 85, capacity: 100 },
      { department: "ICU", current: 90, predicted: 95, capacity: 100 },
      { department: "Surgery", current: 60, predicted: 70, capacity: 100 },
      { department: "Cardiology", current: 55, predicted: 65, capacity: 100 }
    ]
    };
  };

  useEffect(() => {
    setForecastData(generateForecastData(selectedPeriod));
  }, [selectedPeriod]);

  if (!forecastData) {
    return <div>Loading...</div>;
  }

  const aiMetrics = {
    accuracy: 94.2,
    confidence: 89.5,
    predictions: 1247,
    alerts: 23
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-indigo-500" />
                Forecasting & Analytics
              </h1>
              <p className="text-gray-600">AI-powered predictive analytics and forecasting • {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === "7days" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedPeriod("7days")}
            >
              7 Days
            </Button>
            <Button 
              variant={selectedPeriod === "30days" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedPeriod("30days")}
            >
              30 Days
            </Button>
            <Button 
              variant={selectedPeriod === "90days" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedPeriod("90days")}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* AI Metrics Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Accuracy</p>
                  <h3 className="text-2xl font-bold text-green-600">{aiMetrics.accuracy}%</h3>
                </div>
                <Brain className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                  <h3 className="text-2xl font-bold text-blue-600">{aiMetrics.confidence}%</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Predictions Made</p>
                  <h3 className="text-2xl font-bold text-purple-600">{aiMetrics.predictions}</h3>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <h3 className="text-2xl font-bold text-orange-600">{aiMetrics.alerts}</h3>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Admission Forecast */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Patient Admission Forecast
            </CardTitle>
            <p className="text-sm text-gray-600">Predicted vs actual patient admissions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.patientAdmissions.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium w-16">{data.date}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Predicted: {data.predicted}
                      </Badge>
                      {data.actual && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Actual: {data.actual}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      {Math.round(data.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Demand Forecast */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-green-500" />
              Resource Demand Forecast
            </CardTitle>
            <p className="text-sm text-gray-600">Predicted resource requirements</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {forecastData.resourceDemand.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{resource.resource}</h4>
                    <span className={`text-sm ${getTrendColor(resource.trend)}`}>
                      {getTrendIcon(resource.trend)} {resource.trend}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-xl font-bold text-blue-600">{resource.current}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Predicted</p>
                      <p className="text-xl font-bold text-purple-600">{resource.predicted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Change</p>
                      <p className={`text-xl font-bold ${resource.predicted > resource.current ? 'text-red-600' : 'text-green-600'}`}>
                        {resource.predicted > resource.current ? '+' : ''}{resource.predicted - resource.current}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Load Analysis */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Department Load Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">Current vs predicted department utilization</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.departmentLoad.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{dept.department}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Current: {dept.current}%
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        Predicted: {dept.predicted}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full relative"
                      style={{ width: `${dept.current}%` }}
                    >
                      <div 
                        className="absolute top-0 bg-purple-500 h-3 rounded-full opacity-70"
                        style={{ width: `${(dept.predicted / dept.current) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0%</span>
                    <span>Capacity: {dept.capacity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Resource Alert</h4>
                <p className="text-sm text-yellow-700">ICU capacity expected to reach 95% by Dec 18. Consider preparing additional beds.</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800">Staffing Recommendation</h4>
                <p className="text-sm text-blue-700">Increase nursing staff by 15% during Dec 17-19 peak period.</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800">Optimization Opportunity</h4>
                <p className="text-sm text-green-700">Surgery department has 30% available capacity. Consider scheduling elective procedures.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}