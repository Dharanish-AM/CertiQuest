import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/user";
import { getDefaultProfile, saveProfile, loadProfile } from "@/lib/profile";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/service/userService";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const response = await getUser(localStorage.getItem("token"));
      console.log(response.user);
      setProfile(response.user);
    };
    loadData();
  }, [navigate]);

  const handleSave = () => {
    if (profile) {
      saveProfile(profile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleBack = () => {
    if (profile?.role === "Student") {
      navigate("/student");
    } else if (profile?.role === "Faculty") {
      navigate("/faculty");
    } else {
      navigate("/admin");
    }
  };

  const updateField = (field: keyof UserProfile, value: unknown) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const addInterest = (interest: string) => {
    if (profile && profile.interests) {
      setProfile({
        ...profile,
        interests: [...profile.interests, interest],
      });
    }
  };

  const removeInterest = (interest: string) => {
    if (profile && profile.interests) {
      setProfile({
        ...profile,
        interests: profile.interests.filter((i) => i !== interest),
      });
    }
  };

  if (!profile) return null;

  const getInitials = (name?: string) => {
    console.log(name)
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">My Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="p-8 mb-6 shadow-card">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-secondary text-white">
                  {getInitials(profile.name) as string}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                  onClick={() => toast.info("Photo upload coming soon")}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-3xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {profile.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Member since{" "}
                {new Date(profile.createdAt || "").toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6 mb-6 shadow-card">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.name}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Role-Specific Information */}
        {profile.role === "Student" && (
          <Card className="p-6 mb-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4">Student Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={profile.university || ""}
                    onChange={(e) => updateField("university", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree Program</Label>
                  <Input
                    id="degree"
                    value={profile.degree || ""}
                    onChange={(e) => updateField("degree", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={profile.graduationYear || ""}
                  onChange={(e) =>
                    updateField("graduationYear", parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                  className="max-w-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Areas of Interest</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.interests?.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => removeInterest(interest)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add interest (e.g., Machine Learning)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addInterest(input.value.trim());
                            input.value = "";
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {profile.role === "Faculty" && (
          <Card className="p-6 mb-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4">Faculty Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department || ""}
                    onChange={(e) => updateField("department", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={profile.specialization || ""}
                    onChange={(e) =>
                      updateField("specialization", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profile.yearsOfExperience || ""}
                  onChange={(e) =>
                    updateField("yearsOfExperience", parseInt(e.target.value))
                  }
                  disabled={!isEditing}
                  className="max-w-xs"
                />
              </div>
            </div>
          </Card>
        )}

        {profile.role === "Admin" && (
          <Card className="p-6 mb-6 shadow-card">
            <h3 className="text-xl font-semibold mb-4">Admin Information</h3>
            <div className="space-y-4"></div>
          </Card>
        )}

        {/* Account Settings */}
        <Card className="p-6 shadow-card">
          <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <Button
                variant="outline"
                onClick={() => toast.info("Password change coming soon")}
              >
                Change Password
              </Button>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2 text-destructive">
                Danger Zone
              </h4>
              <Button
                variant="destructive"
                onClick={() =>
                  toast.error("Account deletion requires confirmation")
                }
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
