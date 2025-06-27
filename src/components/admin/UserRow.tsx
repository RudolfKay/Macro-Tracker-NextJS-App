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

export const UserRow: React.FC<UserRowProps> = ({ user, isCurrentUser, onEdit, onDelete }) => (
  <div
    className="flex items-center gap-4 py-4 px-2 group hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition cursor-pointer"
    tabIndex={0}
    aria-label={`User ${user.name}`}
  >
    <Button
      variant="ghost"
      size="icon"
      className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none"
      aria-label="Edit user"
      tabIndex={0}
      onClick={() => onEdit(user)}
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
        onClick={() => onDelete(user)}
      >
        <Trash2 className="w-5 h-5 text-neutral-500 group-hover:text-red-600" />
      </Button>
    )}
    <div className="flex-1">
      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        {user.name}
        {user.role === "ADMIN" && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Admin</span>
        )}
      </div>
      <div className="text-neutral-500 text-sm">{user.email}</div>
    </div>
    <div className="text-neutral-400 text-xs">
      {new Date(user.createdAt).toLocaleDateString()}
    </div>
  </div>
); 