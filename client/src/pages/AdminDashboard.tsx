import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LogOut,
  Users,
  Award,
  Plus,
  Settings,
  User,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loadUsers, addUser, removeUser } from "@/lib/users";
import { addCert, loadCerts, removeCert } from "@/lib/certs";
import { UserProfile } from "@/types/user";
import { Certification } from "@/types/certification";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // Dialog states
  const [openAddCert, setOpenAddCert] = useState(false);
  const [openManageUsers, setOpenManageUsers] = useState(false);

  // Certification form state
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certProvider, setCertProvider] = useState("");
  const [certDomain, setCertDomain] = useState("");
  const [certCost, setCertCost] = useState<number>(0);
  const [certDescription, setCertDescription] = useState("");
  const [certDeadline, setCertDeadline] = useState("");
  const [certCredibility, setCertCredibility] = useState<
    "verified" | "trusted" | "new"
  >("new");
  const [certFacultyVerified, setCertFacultyVerified] = useState(false);
  const [certImageUrl, setCertImageUrl] = useState("");

  // Users
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");
  useEffect(() => setUsers(loadUsers()), []);
  const usersFiltered = users.filter(
    (u) =>
      !userSearch ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Certifications
  const [certs, setCerts] = useState<Certification[]>([]);
  useEffect(() => setCerts(loadCerts()), []);

  // Add/Edit Certification
  const handleAddCertSubmit = () => {
    const certData: Certification = {
      id: editingCertId || "c_" + Date.now(),
      title: certTitle,
      provider: certProvider,
      domain: certDomain || "General",
      cost: certCost,
      description: certDescription,
      deadline:
        certDeadline ||
        new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      credibility: certCredibility,
      facultyVerified: certFacultyVerified,
      imageUrl: certImageUrl,
    };

    if (editingCertId) {
      // Remove old and add updated
      removeCert(editingCertId);
      addCert(certData);
      toast.success("Certification updated");
    } else {
      addCert(certData);
      toast.success("Certification added");
    }

    setEditingCertId(null);
    setCertTitle("");
    setCertProvider("");
    setCertDomain("");
    setCertCost(0);
    setCertDescription("");
    setCertDeadline("");
    setCertCredibility("new");
    setCertFacultyVerified(false);
    setCertImageUrl("");
    setOpenAddCert(false);
    setCerts(loadCerts());
  };

  const handleEditCert = (cert: Certification) => {
    setEditingCertId(cert.id);
    setCertTitle(cert.title);
    setCertProvider(cert.provider);
    setCertDomain(cert.domain);
    setCertCost(cert.cost);
    setCertDescription(cert.description);
    setCertDeadline(cert.deadline);
    setCertCredibility(cert.credibility as "verified" | "trusted" | "new");
    setCertFacultyVerified(cert.facultyVerified);
    setCertImageUrl(cert.imageUrl || "");
    setOpenAddCert(true);
  };

  const handleDeleteCert = (id: string) => {
    removeCert(id);
    setCerts(loadCerts());
    toast.success("Certification deleted");
  };

  // User management
  const handleAddUser = (u: UserProfile) => {
    addUser(u);
    setUsers(loadUsers());
    toast.success("User added");
  };

  const handleRemoveUser = (id: string) => {
    removeUser(id);
    setUsers(loadUsers());
    toast.success("User removed");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CertiQuest - Admin</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage certifications, users, and platform analytics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-foreground">1,247</p>
              </div>
              <Users className="w-12 h-12 text-primary" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Certifications
                </p>
                <p className="text-3xl font-bold text-foreground">156</p>
              </div>
              <Award className="w-12 h-12 text-secondary" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active This Month
                </p>
                <p className="text-3xl font-bold text-foreground">892</p>
              </div>
              <TrendingUp className="w-12 h-12 text-verified" />
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Pending Reviews
                </p>
                <p className="text-3xl font-bold text-foreground">23</p>
              </div>
              <AlertCircle className="w-12 h-12 text-accent" />
            </div>
          </Card>
        </div>

        {/* Top Actions */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={() => setOpenAddCert(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
          <Button variant="outline" onClick={() => setOpenManageUsers(true)}>
            <Settings className="w-4 h-4 mr-2" /> Manage Users
          </Button>
        </div>

        {/* Certifications List */}
        <div className="bg-white shadow-card rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">All Certifications</h3>
          {certs.length === 0 ? (
            <p className="text-muted-foreground">
              No certifications added yet.
            </p>
          ) : (
            <div className="space-y-3">
              {certs.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div>
                    <p className="font-medium">{cert.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {cert.provider} • {cert.domain} • ${cert.cost}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCert(cert)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCert(cert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Certification Dialog */}
      <Dialog open={openAddCert} onOpenChange={setOpenAddCert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCertId ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
            />
            <Input
              placeholder="Provider"
              value={certProvider}
              onChange={(e) => setCertProvider(e.target.value)}
            />
            <Input
              placeholder="Domain"
              value={certDomain}
              onChange={(e) => setCertDomain(e.target.value)}
            />
            <Input
              placeholder="Cost"
              type="number"
              value={certCost}
              onChange={(e) => setCertCost(Number(e.target.value))}
            />
            <Input
              placeholder="Deadline"
              type="date"
              value={certDeadline}
              onChange={(e) => setCertDeadline(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={certDescription}
              onChange={(e) => setCertDescription(e.target.value)}
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setOpenAddCert(false)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleAddCertSubmit}
              disabled={!certTitle || !certProvider}
            >
              {editingCertId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Users Dialog */}
      <Dialog open={openManageUsers} onOpenChange={setOpenManageUsers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No users added yet.
              </p>
            )}
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">{u.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {u.email} • {u.role}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveUser(u.id)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="pt-4">
              <h4 className="font-semibold">Add user</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <Input placeholder="Full name" id="admin_new_user_name" />
                <Input placeholder="Email" id="admin_new_user_email" />
                <select
                  id="admin_new_user_role"
                  className="rounded-md border px-2 py-2"
                >
                  <option value="student">student</option>
                  <option value="faculty">faculty</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={() => {
                    const nameEl = document.getElementById(
                      "admin_new_user_name"
                    ) as HTMLInputElement;
                    const emailEl = document.getElementById(
                      "admin_new_user_email"
                    ) as HTMLInputElement;
                    const roleEl = document.getElementById(
                      "admin_new_user_role"
                    ) as HTMLSelectElement;
                    if (!nameEl?.value || !emailEl?.value)
                      return toast.error("Name and email required");
                    handleAddUser({
                      id: "u_" + Date.now(),
                      fullName: nameEl.value,
                      email: emailEl.value,
                      role: roleEl.value as UserProfile["role"],
                    });
                    nameEl.value = "";
                    emailEl.value = "";
                    roleEl.value = "student";
                  }}
                >
                  Add User
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setOpenManageUsers(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
