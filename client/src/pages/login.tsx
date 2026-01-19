import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, User, Lock, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Dashboard from "./dashboard";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });
  const [currentView, setCurrentView] = useState('login');
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      if (!formData.email || !formData.username || !formData.password) {
        alert("Please fill all fields!");
        return;
      }
      alert("Account created successfully! You can now login.");
      setMode('login');
      setFormData({ username: "", password: "", email: "", confirmPassword: "" });
    } else if (mode === 'forgot') {
      if (!formData.email) {
        alert("Please enter your email address!");
        return;
      }
      alert(`Password reset instructions sent to ${formData.email}!`);
      setMode('login');
      setFormData({ username: "", password: "", email: "", confirmPassword: "" });
    } else {
      // Handle login
      if (!formData.username || !formData.password) {
        alert("Please enter username and password!");
        return;
      }
      // Allow any username/password to login
      setCurrentView('dashboard');
    }
  };



  // Show dashboard component based on login
  if (currentView === 'dashboard') {
    return <Dashboard onLogout={() => setCurrentView('login')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">HealthFlow Hub</h1>
          <p className="text-gray-300 mt-2">AI-Powered Healthcare Management</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {mode === 'forgot' ? 'Reset Password' : mode === 'signup' ? 'Create Account' : 'Login to System'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {mode === 'forgot' ? 'Enter your email to reset password' : 
               mode === 'signup' ? 'Sign up for a new account' : 'Enter your credentials to continue'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'forgot' ? (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="username">Username</Label>
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

                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {mode === 'forgot' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode !== 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm block w-full"
                >
                  {mode === 'signup' ? "Already have an account? Login here" : "Don't have an account? Sign up here"}
                </button>
              )}
              
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm block w-full"
                >
                  Forgot your password?
                </button>
              )}
              
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormData({ username: "", password: "", email: "", confirmPassword: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm block w-full"
                >
                  Back to Login
                </button>
              )}
            </div>
          </CardContent>
        </Card>



        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Secure • HIPAA Compliant • 24/7 Support</p>
        </div>
      </div>
    </div>
  );
}