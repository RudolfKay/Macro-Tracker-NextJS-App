import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: { name: string; email: string; newPassword: string; currentPassword: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  onCancel: () => void;
};

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onOpenChange, form, onChange, onSubmit, loading, onCancel }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
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
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" name="newPassword" type="password" value={form.newPassword} onChange={onChange} minLength={6} disabled={loading} placeholder="Leave blank to keep current password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={onChange} required disabled={loading} />
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={loading} onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
); 