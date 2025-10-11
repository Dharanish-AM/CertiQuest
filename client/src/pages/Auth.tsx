import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, Shield } from "lucide-react";
import { UserRole } from "@/types/certification";
import heroImage from "@/assets/hero-image.jpg";
import axios from "axios";

export default function Auth() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
        }
      );

      console.log("Login Success:", data.user);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "Student") navigate("/student");
      else if (data.user.role === "Faculty") navigate("/faculty");
      else navigate("/admin");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 z-10" />
        <img
          src={heroImage}
          alt="Students learning"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">CertiQuest</h1>
            <p className="text-xl opacity-90">
              Your trusted certification directory
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="p-6 shadow-card">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="***********"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Sign In
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="p-6 shadow-card">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <select
                      id="signup-role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="Student">Student</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="***********"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const { data } = await axios.post(
                          "http://localhost:8000/api/users/signup",
                          {
                            name: fullName,
                            email,
                            password,
                            role: selectedRole,
                          }
                        );
                        console.log("Signup Success:", data.user);
                        navigate("/auth")
                      } catch (err) {
                        console.error(err);
                        if (
                          err.response &&
                          err.response.data &&
                          err.response.data.message
                        ) {
                          alert(err.response.data.message);
                        } else {
                          alert("Signup failed. Please try again.");
                        }
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
