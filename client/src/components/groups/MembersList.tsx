import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface MembersListProps {
  members: string[];
  isOwner: boolean;
  onManageMembers: () => void;
  onRemoveMember: (memberName: string) => void;
}

export const MembersList = ({ members, isOwner, onManageMembers, onRemoveMember }: MembersListProps) => {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground">Members</h3>
        {isOwner && (
          <Button
            size="sm"
            variant="outline"
            onClick={onManageMembers}
            className="gap-1"
          >
            <UserPlusIcon className="h-4 w-4" />
            Manage
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {members.map((user, index) => (
          <div key={index} className="flex items-center justify-between gap-2 rounded-md bg-muted/50 p-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-card-foreground">{user}</span>
            </div>
            {isOwner && (
              <button
                onClick={() => onRemoveMember(user)}
                className="text-destructive hover:text-destructive/80 transition-colors"
                title="Remove member"
              >
                <UserMinusIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No members yet</p>
        )}
      </div>
    </div>
  );
};
