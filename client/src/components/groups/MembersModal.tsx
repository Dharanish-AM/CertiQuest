import { Dialog } from "@headlessui/react";
import { XMarkIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MembersModalProps {
  isOpen: boolean;
  members: string[];
  newMemberName: string;
  onClose: () => void;
  onAddMember: () => void;
  onRemoveMember: (memberName: string) => void;
  onNewMemberNameChange: (value: string) => void;
}

export const MembersModal = ({
  isOpen,
  members,
  newMemberName,
  onClose,
  onAddMember,
  onRemoveMember,
  onNewMemberNameChange,
}: MembersModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-card-foreground">Manage Members</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">Add Member</label>
              <div className="flex gap-2">
                <Input
                  value={newMemberName}
                  onChange={(e) => onNewMemberNameChange(e.target.value)}
                  placeholder="Enter member name"
                  onKeyPress={(e) => e.key === "Enter" && onAddMember()}
                />
                <Button onClick={onAddMember} disabled={!newMemberName.trim()}>
                  <UserPlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Current Members ({members.length})
              </label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-border p-2">
                {members.map((user, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-card-foreground">{user}</span>
                    </div>
                    <button
                      onClick={() => onRemoveMember(user)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      title="Remove member"
                    >
                      <UserMinusIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">No members yet</p>
                )}
              </div>
            </div>
            <Button onClick={onClose} variant="outline" className="w-full">
              Done
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
