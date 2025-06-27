import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import type { User } from "@/types/user";

type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Pick<User, 'id' | 'name'> | null;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({ open, onOpenChange, user, loading, onCancel, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
      </DialogHeader>
      <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{user?.name}</span>? This action cannot be undone.</div>
      <DialogFooter className="flex flex-row gap-2 justify-end">
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={loading} onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
); 