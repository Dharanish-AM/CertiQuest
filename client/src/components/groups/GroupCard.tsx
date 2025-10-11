import { UserGroupIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Group {
  id: string;
  name: string;
  description: string;
  users: string[];
  ownerId: string;
}

interface GroupCardProps {
  group: Group;
  isSelected: boolean;
  isOwner: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const GroupCard = ({ group, isSelected, isOwner, onSelect, onEdit, onDelete }: GroupCardProps) => {
  return (
    <div
      className={`relative rounded-lg border p-4 transition-all duration-300 ${
        isSelected
          ? "border-primary bg-accent/10 shadow-md"
          : "border-border bg-card hover:border-accent hover:shadow-lg"
      }`}
    >
      <div onClick={onSelect} className="cursor-pointer">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-card-foreground">{group.name}</h3>
          {isOwner && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Owner
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{group.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <UserGroupIcon className="h-4 w-4" />
          {group.users.length} member{group.users.length !== 1 ? "s" : ""}
        </div>
      </div>
      {isOwner && (
        <div className="mt-3 flex gap-2 border-t pt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
