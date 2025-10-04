import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, CheckCircle2, Clock, TrendingUp, X, User } from "lucide-react";
import { toast } from "sonner";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [pendingVerifications, setPendingVerifications] = useState([
    { id: "1", title: "AWS Certified Solutions Architect", provider: "Amazon Web Services", domain: "Cloud Computing" },
    { id: "2", title: "Google Professional ML Engineer", provider: "Google Cloud", domain: "Machine Learning" },
    { id: "3", title: "TensorFlow Developer Certificate", provider: "Google", domain: "Machine Learning" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleVerify = (id: string, title: string) => {
    setPendingVerifications(prev => prev.filter(cert => cert.id !== id));
    toast.success(`Verified: ${title}`, {
      description: "This certification is now marked as faculty verified"
    });
  };

  const handleReject = (id: string, title: string) => {
    setPendingVerifications(prev => prev.filter(cert => cert.id !== id));
    toast.error(`Rejected: ${title}`, {
      description: "This certification was not verified"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent">CertiQuest - Faculty</h1>
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
          <h2 className="text-3xl font-bold mb-2">Faculty Dashboard</h2>
          <p className="text-muted-foreground">Review and verify certifications for students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
                <p className="text-3xl font-bold text-foreground">{pendingVerifications.length}</p>
              </div>
              <Clock className="w-12 h-12 text-accent" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verified This Month</p>
                <p className="text-3xl font-bold text-foreground">12</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-verified" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Student Impact</p>
                <p className="text-3xl font-bold text-foreground">284</p>
              </div>
              <TrendingUp className="w-12 h-12 text-secondary" />
            </div>
          </Card>
        </div>

        {/* Pending Verifications */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Pending Verifications</h3>
          {pendingVerifications.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-verified mx-auto mb-3" />
              <p className="text-lg font-medium mb-1">All caught up!</p>
              <p className="text-muted-foreground">No certifications pending verification</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map((cert) => (
                <Card key={cert.id} className="p-6 shadow-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{cert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{cert.provider}</p>
                      <Badge variant="outline">{cert.domain}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleVerify(cert.id, cert.title)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Verify
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(cert.id, cert.title)}
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
