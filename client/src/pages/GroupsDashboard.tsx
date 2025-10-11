import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import {
  DocumentTextIcon,
  VideoCameraIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  PlusIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GroupCard } from "@/components/groups/GroupCard";
import { MembersList } from "@/components/groups/MembersList";
import { GroupModal } from "@/components/groups/GroupModal";
import { MembersModal } from "@/components/groups/MembersModal";
import { ArrowLeft } from "lucide-react";

// Types
type ResourceType = "Documents" | "Videos" | "Practice Tests" | "Notes";

interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
  users: string[];
  ownerId: string;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

const CURRENT_USER_ID = "user1";

const initialGroups: Group[] = [
  {
    id: "1",
    name: "Web Development Study Group",
    description: "Learn React, TypeScript, and modern web development together",
    ownerId: CURRENT_USER_ID,
    resources: [
      { id: "r1", title: "React Hooks Guide", type: "Documents", url: "#" },
      {
        id: "r2",
        title: "TypeScript Tutorial Video",
        type: "Videos",
        url: "#",
      },
      {
        id: "r3",
        title: "React Quiz - Components",
        type: "Practice Tests",
        url: "#",
      },
    ],
    users: ["Dharanish A M", "Bavanetha M R", "Harshini M"],
  },
  {
    id: "2",
    name: "Data Science Fundamentals",
    description: "Master Python, pandas, and machine learning basics",
    ownerId: "user2",
    resources: [
      { id: "r4", title: "Python Data Analysis", type: "Documents", url: "#" },
      { id: "r5", title: "ML Introduction", type: "Videos", url: "#" },
    ],
    users: ["Arun Kumar", "Priya Ramesh", "Vignesh K", "Divya S"],
  },
  {
    id: "3",
    name: "Design Principles",
    description: "UI/UX design, Figma, and creative workflows",
    ownerId: CURRENT_USER_ID,
    resources: [
      { id: "r6", title: "Figma Basics", type: "Documents", url: "#" },
      {
        id: "r7",
        title: "Color Theory Test",
        type: "Practice Tests",
        url: "#",
      },
    ],
    users: ["Karthik S", "Meena R", "Sundar P"],
  },
];

const initialMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      user: "Dharanish A M",
      text: "Hey everyone! Ready for today's session?",
      timestamp: new Date(),
    },
    {
      id: "m2",
      user: "Bavanetha M R",
      text: "Yes! Looking forward to learning React Hooks",
      timestamp: new Date(),
    },
    {
      id: "m3",
      user: "Harshini M",
      text: "Same here! The guide looks really helpful",
      timestamp: new Date(),
    },
  ],
  "2": [
    {
      id: "m4",
      user: "Arun Kumar",
      text: "Anyone started the pandas tutorial?",
      timestamp: new Date(),
    },
    {
      id: "m5",
      user: "Priya Ramesh",
      text: "Working through it now, great resource!",
      timestamp: new Date(),
    },
  ],
  "3": [
    {
      id: "m6",
      user: "Karthik S",
      text: "Check out the new Figma file I shared",
      timestamp: new Date(),
    },
    {
      id: "m7",
      user: "Meena R",
      text: "Love the color palette!",
      timestamp: new Date(),
    },
  ],
};

const GroupsDashboard = () => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(
    initialGroups[0]
  );
  const [activeTab, setActiveTab] = useState<ResourceType>("Documents");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [isUploadResourceOpen, setIsUploadResourceOpen] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceType, setNewResourceType] =
    useState<ResourceType>("Documents");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [chatMessages, setChatMessages] =
    useState<Record<string, ChatMessage[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [collaborativeNotes, setCollaborativeNotes] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const tabs: ResourceType[] = [
    "Documents",
    "Videos",
    "Practice Tests",
    "Notes",
  ];

  const isOwner = (group: Group) => group.ownerId === CURRENT_USER_ID;

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case "Documents":
        return DocumentTextIcon;
      case "Videos":
        return VideoCameraIcon;
      case "Practice Tests":
        return ClipboardDocumentListIcon;
      case "Notes":
        return PencilIcon;
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName,
        description: newGroupDescription,
        resources: [],
        users: [],
        ownerId: CURRENT_USER_ID,
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setNewGroupDescription("");
      setIsCreateGroupOpen(false);
    }
  };

  const handleEditGroup = () => {
    if (selectedGroup && newGroupName.trim()) {
      const updatedGroups = groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, name: newGroupName, description: newGroupDescription }
          : g
      );
      setGroups(updatedGroups);
      setSelectedGroup({
        ...selectedGroup,
        name: newGroupName,
        description: newGroupDescription,
      });
      setNewGroupName("");
      setNewGroupDescription("");
      setIsEditGroupOpen(false);
    }
  };

  const openEditModal = (group: Group) => {
    setSelectedGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description);
    setGroupModalMode("edit");
    setIsEditGroupOpen(true);
  };

  const openCreateModal = () => {
    setNewGroupName("");
    setNewGroupDescription("");
    setGroupModalMode("create");
    setIsCreateGroupOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm("Are you sure you want to delete this group?")) {
      setGroups(groups.filter((g) => g.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  const handleAddMember = () => {
    if (selectedGroup && newMemberName.trim()) {
      const updatedGroups = groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, users: [...g.users, newMemberName] }
          : g
      );
      setGroups(updatedGroups);
      setSelectedGroup({
        ...selectedGroup,
        users: [...selectedGroup.users, newMemberName],
      });
      setNewMemberName("");
    }
  };

  const handleRemoveMember = (memberName: string) => {
    if (selectedGroup) {
      const updatedGroups = groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, users: g.users.filter((u) => u !== memberName) }
          : g
      );
      setGroups(updatedGroups);
      setSelectedGroup({
        ...selectedGroup,
        users: selectedGroup.users.filter((u) => u !== memberName),
      });
    }
  };

  const handleUploadResource = () => {
    if (selectedGroup && newResourceTitle.trim()) {
      const newResource: Resource = {
        id: Date.now().toString(),
        title: newResourceTitle,
        type: newResourceType,
        url: newResourceUrl || "#",
      };
      const updatedGroups = groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, resources: [...g.resources, newResource] }
          : g
      );
      setGroups(updatedGroups);
      setSelectedGroup({
        ...selectedGroup,
        resources: [...selectedGroup.resources, newResource],
      });
      setNewResourceTitle("");
      setNewResourceUrl("");
      setIsUploadResourceOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (selectedGroup && newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        text: newMessage,
        timestamp: new Date(),
      };
      setChatMessages({
        ...chatMessages,
        [selectedGroup.id]: [
          ...(chatMessages[selectedGroup.id] || []),
          message,
        ],
      });
      setNewMessage("");
    }
  };

  const currentResources =
    selectedGroup?.resources.filter((r) => r.type === activeTab) || [];
  const currentMessages = selectedGroup
    ? chatMessages[selectedGroup.id] || []
    : [];

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/student")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Study Groups Dashboard
              </h1>
            </div>
            <Button onClick={openCreateModal} className="gap-2">
              <PlusIcon className="h-5 w-5" />
              Create Group
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Groups Section */}
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Your Groups
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isSelected={selectedGroup?.id === group.id}
                  isOwner={isOwner(group)}
                  onSelect={() => setSelectedGroup(group)}
                  onEdit={() => openEditModal(group)}
                  onDelete={() => handleDeleteGroup(group.id)}
                />
              ))}
            </div>
          </div>

          {selectedGroup && (
            <>
              {/* Resource Library */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-card-foreground">
                      Resource Library
                    </h2>
                    <Button
                      onClick={() => setIsUploadResourceOpen(true)}
                      size="sm"
                      className="gap-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>

                  {/* Tabs */}
                  <div className="mb-6 flex gap-2 border-b">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Resource Cards or Notes */}
                  {activeTab === "Notes" ? (
                    <div>
                      <h3 className="mb-3 font-medium text-card-foreground">
                        Collaborative Notes
                      </h3>
                      <Textarea
                        value={collaborativeNotes}
                        onChange={(e) => setCollaborativeNotes(e.target.value)}
                        placeholder="Start taking notes together..."
                        className="min-h-[300px] resize-none"
                      />
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {currentResources.length > 0 ? (
                        currentResources.map((resource) => {
                          const Icon = getIconForType(resource.type);
                          return (
                            <div
                              key={resource.id}
                              className="rounded-lg border bg-muted/30 p-4 transition-all hover:shadow-md"
                            >
                              <div className="mb-3 flex items-start gap-3">
                                <Icon className="h-6 w-6 flex-shrink-0 text-primary" />
                                <h4 className="font-medium text-card-foreground">
                                  {resource.title}
                                </h4>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                View
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="col-span-2 py-8 text-center text-muted-foreground">
                          No {activeTab.toLowerCase()} available. Upload one to
                          get started!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat & Users Sidebar */}
              <div className="space-y-6">
                {/* Users in Group */}
                <MembersList
                  members={selectedGroup.users}
                  isOwner={isOwner(selectedGroup)}
                  onManageMembers={() => setIsManageMembersOpen(true)}
                  onRemoveMember={handleRemoveMember}
                />

                {/* Chat */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="border-b p-4">
                    <h3 className="font-semibold text-card-foreground">
                      Group Chat
                    </h3>
                  </div>
                  <div className="h-[400px] overflow-y-auto bg-chat-bg p-4">
                    <div className="space-y-3">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="rounded-lg bg-chat-bubble p-3 text-chat-bubble-foreground"
                        >
                          <div className="mb-1 text-xs font-semibold opacity-90">
                            {msg.user}
                          </div>
                          <div className="text-sm">{msg.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <Dialog
        open={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-card-foreground">
                Create New Group
              </Dialog.Title>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Group Name
                </label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Web Development Study Group"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Description
                </label>
                <Textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What will this group focus on?"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Create Group
                </Button>
                <Button
                  onClick={() => setIsCreateGroupOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Group Modal */}
      <Dialog
        open={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-card-foreground">
                Edit Group
              </Dialog.Title>
              <button
                onClick={() => setIsEditGroupOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Group Name
                </label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Web Development Study Group"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Description
                </label>
                <Textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What will this group focus on?"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleEditGroup} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  onClick={() => setIsEditGroupOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Manage Members Modal */}
      <Dialog
        open={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-card-foreground">
                Manage Members
              </Dialog.Title>
              <button
                onClick={() => setIsManageMembersOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Add Member
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter member name"
                    onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
                  />
                  <Button onClick={handleAddMember}>
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-card-foreground">
                  Current Members
                </label>
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {selectedGroup?.users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-muted/50 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {user.charAt(0)}
                        </div>
                        <span className="text-sm text-card-foreground">
                          {user}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(user)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {(!selectedGroup?.users ||
                    selectedGroup.users.length === 0) && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No members yet
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setIsManageMembersOpen(false)}
                variant="outline"
                className="w-full"
              >
                Done
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Upload Resource Modal */}
      <Dialog
        open={isUploadResourceOpen}
        onClose={() => setIsUploadResourceOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-card-foreground">
                Upload Resource
              </Dialog.Title>
              <button
                onClick={() => setIsUploadResourceOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Resource Title
                </label>
                <Input
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="e.g., React Hooks Tutorial"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Resource Type
                </label>
                <select
                  value={newResourceType}
                  onChange={(e) =>
                    setNewResourceType(e.target.value as ResourceType)
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {tabs
                    .filter((t) => t !== "Notes")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">
                  Resource Link/URL
                </label>
                <Input
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleUploadResource} className="flex-1">
                  Upload
                </Button>
                <Button
                  onClick={() => setIsUploadResourceOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default GroupsDashboard;
