import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GroupModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  groupName: string;
  groupDescription: string;
  onClose: () => void;
  onSubmit: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const GroupModal = ({
  isOpen,
  mode,
  groupName,
  groupDescription,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
}: GroupModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-card-foreground">
              {mode === "create" ? "Create New Group" : "Edit Group"}
            </Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g., Web Development Study Group"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">Description</label>
              <Textarea
                value={groupDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="What will this group focus on?"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={onSubmit} className="flex-1">
                {mode === "create" ? "Create Group" : "Save Changes"}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
