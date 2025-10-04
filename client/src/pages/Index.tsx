import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Shield, CheckCircle2, Search, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Discover Certifications",
      description: "Browse verified certifications from trusted providers across multiple domains"
    },
    {
      icon: CheckCircle2,
      title: "Faculty Verified",
      description: "Get recommendations from experienced faculty members who verify quality"
    },
    {
      icon: Star,
      title: "Student Reviews",
      description: "Read authentic reviews from students who completed the certifications"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-hero bg-clip-text text-transparent">
              CertiQuest
            </h1>
            <Button onClick={() => navigate("/auth")} variant="hero">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <img 
          src={heroImage} 
          alt="Students learning" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Your Trusted Certification Directory
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover, verify, and bookmark professional certifications to advance your career
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-white text-primary hover:bg-white/90 shadow-xl"
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose CertiQuest?</h3>
            <p className="text-lg text-muted-foreground">Everything you need to find the right certification</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-lg transition-smooth">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Built for Everyone</h3>
            <p className="text-lg opacity-90">Tailored experiences for students, faculty, and administrators</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 shadow-lg">
              <GraduationCap className="w-12 h-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">For Students</h4>
              <p className="text-muted-foreground mb-4">
                Search, filter, and bookmark certifications. Set deadline alerts and read reviews.
              </p>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign Up as Student
              </Button>
            </Card>
            <Card className="p-6 shadow-lg">
              <Users className="w-12 h-12 text-secondary mb-4" />
              <h4 className="text-xl font-semibold mb-3">For Faculty</h4>
              <p className="text-muted-foreground mb-4">
                Verify certifications, provide recommendations, and guide students.
              </p>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Sign Up as Faculty
              </Button>
            </Card>
            <Card className="p-6 shadow-lg">
              <Shield className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-3">For Admins</h4>
              <p className="text-muted-foreground mb-4">
                Manage platform, track analytics, and ensure quality standards.
              </p>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Admin Access
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and faculty using CertiQuest to discover verified certifications
          </p>
          <Button size="lg" variant="hero" onClick={() => navigate("/auth")}>
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CertiQuest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
