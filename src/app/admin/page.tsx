"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

const AdminPanel = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    fetchUsers();
    // eslint-disable-next-line
  }, [session, status, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setForm({ name: user.name, email: user.email });
    setEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, name: form.name, email: form.email, role: selectedUser.role }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "User updated!" });
        setEditOpen(false);
        fetchUsers();
      } else {
        toast({ title: "Error", description: data.error || "Failed to update user", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "User deleted!" });
        setDeleteOpen(false);
        fetchUsers();
      } else {
        toast({ title: "Error", description: data.error || "Failed to delete user", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/dashboard" aria-label="Back to Dashboard">
            <span aria-hidden="true">&larr;</span> Dashboard
          </Link>
        </Button>
        <span className="text-2xl font-bold">Admin Panel</span>
      </div>
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 py-4 px-2 group hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition cursor-pointer"
            tabIndex={0}
            aria-label={`User ${user.name}`}
          >
            <button
              className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none"
              aria-label="Edit user"
              tabIndex={0}
              onClick={() => handleEditClick(user)}
            >
              <Pencil className="w-5 h-5 text-neutral-500 group-hover:text-blue-600" />
            </button>
            {user.id !== session?.user?.id && (
              <button
                className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:outline-none"
                aria-label="Delete user"
                tabIndex={0}
                onClick={() => handleDeleteClick(user)}
              >
                <Trash2 className="w-5 h-5 text-neutral-500 group-hover:text-red-600" />
              </button>
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
        ))}
      </div>
      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleEditChange} required disabled={formLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleEditChange} required disabled={formLoading} />
            </div>
            <DialogFooter className="flex flex-row gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={formLoading}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete User Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="mb-4">Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? This action cannot be undone.</div>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={deleteLoading}>Cancel</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel; 