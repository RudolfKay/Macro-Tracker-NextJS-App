import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import type { UserRole } from "@/types/user";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: { name: string; email: string; role: UserRole };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  onCancel: () => void;
};

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onOpenChange, form, onChange, onRoleChange, onSubmit, loading, onCancel }) => {
  const isSaveDisabled = !form.name.trim() || !form.email.trim() || loading;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-md w-full p-4 sm:p-6" aria-describedby="edit-user-description">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription className="sr-only" id="edit-user-description">
            Edit user details below. Name, email, and role are required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={onChange} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={onRoleChange}
              disabled={loading}
              className="block w-full rounded border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="User role"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading} onClick={onCancel}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaveDisabled}>{loading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 