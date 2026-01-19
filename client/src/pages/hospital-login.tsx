import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User, Lock, Shield, Stethoscope, Users, Activity, Brain } from "lucide-react";

export default function HospitalLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    hospitalId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Hospital login:", formData);
    // Redirect to hospital dashboard
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Hospital Management</h1>
          <p className="text-gray-300 mt-2">AI-Powered Healthcare Administration</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Staff Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="hospitalId">Hospital ID</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="hospitalId"
                    type="text"
                    className="pl-10"
                    placeholder="HOSP001"
                    value={formData.hospitalId}
                    onChange={(e) => setFormData({...formData, hospitalId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username / Staff ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Access Hospital System
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Forgot credentials? Contact IT Support
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <p className="text-sm font-medium mb-3">Hospital Management Features:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span>AI Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Patient Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-green-400" />
                <span>Staff Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-400" />
                <span>Resource Allocation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Secure • HIPAA Compliant • 24/7 Support</p>
        </div>
      </div>
    </div>
  );
}