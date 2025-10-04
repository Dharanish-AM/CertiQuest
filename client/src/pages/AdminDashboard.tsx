import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Users, Award, TrendingUp, AlertCircle, Plus, Settings, FileText, Flag, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleAction = (action: string) => {
    toast.success(`Action: ${action}`, {
      description: "This feature will be available soon"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent">CertiQuest - Admin</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage certifications, users, and platform analytics</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold text-foreground">1,247</p>
              </div>
              <Users className="w-12 h-12 text-primary" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Certifications</p>
                <p className="text-3xl font-bold text-foreground">156</p>
              </div>
              <Award className="w-12 h-12 text-secondary" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active This Month</p>
                <p className="text-3xl font-bold text-foreground">892</p>
              </div>
              <TrendingUp className="w-12 h-12 text-verified" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-foreground">23</p>
              </div>
              <AlertCircle className="w-12 h-12 text-accent" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAction("Add New Certification")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Certification
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAction("Manage Users")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAction("Review Flagged Content")}
              >
                <Flag className="w-4 h-4 mr-2" />
                Review Flagged Content
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => handleAction("Generate Reports")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Reports
              </Button>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4">Top Trending Domains</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Machine Learning</span>
                <span className="text-muted-foreground">234 searches</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Cloud Computing</span>
                <span className="text-muted-foreground">198 searches</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Cybersecurity</span>
                <span className="text-muted-foreground">176 searches</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Data Science</span>
                <span className="text-muted-foreground">142 searches</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
