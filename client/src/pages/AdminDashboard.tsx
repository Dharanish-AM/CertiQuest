import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DOMAINS } from "@/constants/constant";
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
import {
  fetchCertifications,
  addCertification,
} from "@/service/certificationService";
import { removeCert } from "@/lib/certs";
import { UserProfile } from "@/types/user";
import { Certification } from "@/types/certification";
import { fetchUsers } from "@/service/userService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // Dialog states
  const [openAddCert, setOpenAddCert] = useState(false);
  const [openEditCert, setOpenEditCert] = useState(false);
  const [openManageUsers, setOpenManageUsers] = useState(false);

  // Add Certification form state
  const [addCertTitle, setAddCertTitle] = useState("");
  const [addCertProvider, setAddCertProvider] = useState("");
  const [addCertDomain, setAddCertDomain] = useState("General");
  const [addCertCost, setAddCertCost] = useState<number>(0);
  const [addCertDescription, setAddCertDescription] = useState("");
  const [addCertDeadline, setAddCertDeadline] = useState("");
  const [addCertCredibility, setAddCertCredibility] = useState<
    "verified" | "trusted" | "new"
  >("new");
  const [addCertFacultyVerified, setAddCertFacultyVerified] = useState(false);
  const [addCertLink, setAddCertLink] = useState("");

  // Edit Certification form state
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editCertTitle, setEditCertTitle] = useState("");
  const [editCertProvider, setEditCertProvider] = useState("");
  const [editCertDomain, setEditCertDomain] = useState("General");
  const [editCertCost, setEditCertCost] = useState<number>(0);
  const [editCertDescription, setEditCertDescription] = useState("");
  const [editCertDeadline, setEditCertDeadline] = useState("");
  const [editCertCredibility, setEditCertCredibility] = useState<
    "verified" | "trusted" | "new"
  >("new");
  const [editCertFacultyVerified, setEditCertFacultyVerified] = useState(false);
  const [editCertLink, setEditCertLink] = useState("");

  // Users
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState("");

  // If backend for users implemented, replace with API call
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUsers();
      setUsers(data.users || data);
    };
    loadData();
  }, []);

  const usersFiltered = users.filter(
    (u) =>
      !userSearch ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Certifications
  const [certs, setCerts] = useState<Certification[]>([]);
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCertifications();
      setCerts(data.certifications || data);
    };
    loadData();
  }, []);

  // Add Certification
  const handleAddCertSubmit = async () => {
    const certData: Certification = {
      id: "c_" + Date.now(),
      title: addCertTitle,
      provider: addCertProvider,
      domain: addCertDomain || "General",
      cost: addCertCost,
      description: addCertDescription,
      deadline: addCertDeadline ||
        new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      credibility: addCertCredibility,
      facultyVerified: addCertFacultyVerified,
      link: addCertLink,
      createdAt: "",
      updatedAt: ""
    };

    try {
      await addCertification(certData);
      toast.success("Certification added");
      // Refresh certifications from backend
      const data = await fetchCertifications();
      setCerts(data.certifications || data);
    } catch (err) {
      toast.error("Failed to add certification");
    }

    setAddCertTitle("");
    setAddCertProvider("");
    setAddCertDomain("General");
    setAddCertCost(0);
    setAddCertDescription("");
    setAddCertDeadline("");
    setAddCertCredibility("new");
    setAddCertFacultyVerified(false);
    setAddCertLink("");
    setOpenAddCert(false);
  };

  // Open Edit Certification dialog and populate state
  const handleEditCert = (cert: Certification) => {
    setEditingCertId(cert.id);
    setEditCertTitle(cert.title);
    setEditCertProvider(cert.provider);
    setEditCertDomain(cert.domain);
    setEditCertCost(cert.cost);
    setEditCertDescription(cert.description);
    setEditCertDeadline(cert.deadline);
    setEditCertCredibility(cert.credibility as "verified" | "trusted" | "new");
    setEditCertFacultyVerified(cert.facultyVerified);
    setEditCertLink(cert.link || "");
    setOpenEditCert(true);
  };

  // Edit Certification
  const handleEditCertSubmit = async () => {
    if (!editingCertId) return;
    const certData: Certification = {
      id: editingCertId,
      title: editCertTitle,
      provider: editCertProvider,
      domain: editCertDomain || "General",
      cost: editCertCost,
      description: editCertDescription,
      deadline: editCertDeadline ||
        new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      credibility: editCertCredibility,
      facultyVerified: editCertFacultyVerified,
      link: editCertLink,
      createdAt: "",
      updatedAt: ""
    };
    try {
      await addCertification(certData);
      toast.success("Certification updated");
      // Refresh certifications from backend
      const data = await fetchCertifications();
      setCerts(data.certifications || data);
    } catch (err) {
      toast.error("Failed to update certification");
    }

    setEditingCertId(null);
    setEditCertTitle("");
    setEditCertProvider("");
    setEditCertDomain("General");
    setEditCertCost(0);
    setEditCertDescription("");
    setEditCertDeadline("");
    setEditCertCredibility("new");
    setEditCertFacultyVerified(false);
    setEditCertLink("");
    setOpenEditCert(false);
  };

  const handleDeleteCert = async (id: string) => {
    removeCert(id);
    // Refresh certifications from backend
    const data = await fetchCertifications();
    setCerts(data.certifications || data);
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
                <p className="text-3xl font-bold text-foreground">
                  {users.length}
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {certs.length}
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {
                    certs.filter((cert) => {
                      // Use createdAt or fallback to id timestamp if available
                      // createdAt should be ISO string
                      if (!cert.createdAt) return false;
                      const createdDate = new Date(cert.createdAt);
                      const now = new Date();
                      return (
                        createdDate.getMonth() === now.getMonth() &&
                        createdDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {
                    certs.filter((cert) => cert.facultyVerified === false)
                      .length
                  }
                </p>
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
                      {cert.provider} • {cert.domain} • ₹{cert.cost}
                    </p>
                    {cert.link && (
                      <p className="text-xs text-blue-600 mt-1 break-all">
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {cert.link}
                        </a>
                      </p>
                    )}
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

      {/* Add Certification Dialog */}
      <Dialog open={openAddCert} onOpenChange={setOpenAddCert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_title_input"
                className="mb-1 font-medium"
              >
                Title
              </label>
              <Input
                id="add_cert_title_input"
                placeholder="Title"
                value={addCertTitle}
                onChange={(e) => setAddCertTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_provider_input"
                className="mb-1 font-medium"
              >
                Provider
              </label>
              <Input
                id="add_cert_provider_input"
                placeholder="Provider"
                value={addCertProvider}
                onChange={(e) => setAddCertProvider(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="add_cert_link_input" className="mb-1 font-medium">
                Link
              </label>
              <Input
                id="add_cert_link_input"
                placeholder="Certification Link"
                value={addCertLink}
                onChange={(e) => setAddCertLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_domain_select"
                className="mb-1 font-medium"
              >
                Domain
              </label>
              <select
                id="add_cert_domain_select"
                className="w-full rounded-md border px-2 py-2"
                value={addCertDomain}
                onChange={(e) => setAddCertDomain(e.target.value)}
              >
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="add_cert_cost_input" className="mb-1 font-medium">
                Cost
              </label>
              <Input
                id="add_cert_cost_input"
                placeholder="Cost"
                type="number"
                value={addCertCost}
                onChange={(e) => setAddCertCost(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_deadline_input"
                className="mb-1 font-medium"
              >
                Deadline
              </label>
              <Input
                id="add_cert_deadline_input"
                placeholder="Deadline"
                type="date"
                value={addCertDeadline}
                onChange={(e) => setAddCertDeadline(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_description_textarea"
                className="mb-1 font-medium"
              >
                Description
              </label>
              <Textarea
                id="add_cert_description_textarea"
                placeholder="Description"
                value={addCertDescription}
                onChange={(e) => setAddCertDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="add_cert_credibility_select"
                className="mb-1 font-medium"
              >
                Credibility
              </label>
              <select
                id="add_cert_credibility_select"
                className="w-full rounded-md border px-2 py-2"
                value={addCertCredibility}
                onChange={(e) =>
                  setAddCertCredibility(
                    e.target.value as "verified" | "trusted" | "new"
                  )
                }
              >
                <option value="verified">verified</option>
                <option value="trusted">trusted</option>
                <option value="new">new</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setOpenAddCert(false)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleAddCertSubmit}
              disabled={!addCertTitle || !addCertProvider}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Dialog */}
      <Dialog
        open={openEditCert}
        onOpenChange={(open) => {
          setOpenEditCert(open);
          if (!open) setEditingCertId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_title_input"
                className="mb-1 font-medium"
              >
                Title
              </label>
              <Input
                id="edit_cert_title_input"
                placeholder="Title"
                value={editCertTitle}
                onChange={(e) => setEditCertTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_provider_input"
                className="mb-1 font-medium"
              >
                Provider
              </label>
              <Input
                id="edit_cert_provider_input"
                placeholder="Provider"
                value={editCertProvider}
                onChange={(e) => setEditCertProvider(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_link_input"
                className="mb-1 font-medium"
              >
                Link
              </label>
              <Input
                id="edit_cert_link_input"
                placeholder="Certification Link"
                value={editCertLink}
                onChange={(e) => setEditCertLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_domain_select"
                className="mb-1 font-medium"
              >
                Domain
              </label>
              <select
                id="edit_cert_domain_select"
                className="w-full rounded-md border px-2 py-2"
                value={editCertDomain}
                onChange={(e) => setEditCertDomain(e.target.value)}
              >
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_cost_input"
                className="mb-1 font-medium"
              >
                Cost
              </label>
              <Input
                id="edit_cert_cost_input"
                placeholder="Cost"
                type="number"
                value={editCertCost}
                onChange={(e) => setEditCertCost(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_deadline_input"
                className="mb-1 font-medium"
              >
                Deadline
              </label>
              <Input
                id="edit_cert_deadline_input"
                placeholder="Deadline"
                type="date"
                value={editCertDeadline}
                onChange={(e) => setEditCertDeadline(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_description_textarea"
                className="mb-1 font-medium"
              >
                Description
              </label>
              <Textarea
                id="edit_cert_description_textarea"
                placeholder="Description"
                value={editCertDescription}
                onChange={(e) => setEditCertDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="edit_cert_credibility_select"
                className="mb-1 font-medium"
              >
                Credibility
              </label>
              <select
                id="edit_cert_credibility_select"
                className="w-full rounded-md border px-2 py-2"
                value={editCertCredibility}
                onChange={(e) =>
                  setEditCertCredibility(
                    e.target.value as "verified" | "trusted" | "new"
                  )
                }
              >
                <option value="verified">verified</option>
                <option value="trusted">trusted</option>
                <option value="new">new</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpenEditCert(false);
                setEditingCertId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleEditCertSubmit}
              disabled={!editCertTitle || !editCertProvider}
            >
              Update
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
