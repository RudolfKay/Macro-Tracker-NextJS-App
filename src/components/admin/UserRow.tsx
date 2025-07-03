import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import type { User } from "@/types/user";

type UserRowProps = {
  user: User;
  isCurrentUser: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export const UserRow: React.FC<UserRowProps> = ({ user, isCurrentUser, onEdit, onDelete }) => {
  // Keyboard handler for accessibility
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEdit(user);
    }
  };

  return (
    <div
      className="flex flex-row flex-wrap items-center gap-x-2 gap-y-2 py-4 px-2 group hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      tabIndex={0}
      aria-label={`User ${user.name}`}
      onClick={() => onEdit(user)}
      onKeyDown={handleKeyDown}
      role="button"
    >
      <div className="flex-1 min-w-0 text-left">
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          {user.name}
          {user.role === "ADMIN" && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Admin</span>
          )}
        </div>
        <div className="text-neutral-500 text-sm truncate">{user.email}</div>
        <div className="text-neutral-400 text-xs mt-1">{new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      <div className="flex flex-row gap-2 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none"
          aria-label="Edit user"
          tabIndex={0}
          onClick={e => { e.stopPropagation(); onEdit(user); }}
        >
          <Pencil className="w-5 h-5 text-neutral-500 group-hover:text-blue-600" />
        </Button>
        {!isCurrentUser && (
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none"
            aria-label="Delete user"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onDelete(user); }}
          >
            <Trash2 className="w-5 h-5 text-neutral-500 group-hover:text-red-600" />
          </Button>
        )}
      </div>
    </div>
  );
}; 