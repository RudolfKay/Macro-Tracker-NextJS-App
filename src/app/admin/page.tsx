"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserRow } from "@/components/admin/UserRow";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import type { User } from "@/types/user";
import { fetchUsers, updateUser, deleteUser } from "@/api/user";

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
    loadUsers();
    // eslint-disable-next-line
  }, [session, status, router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      setUsers(users);
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
      await updateUser({ id: selectedUser.id, name: form.name, email: form.email, role: selectedUser.role });
      toast({ title: "User updated!" });
      setEditOpen(false);
      loadUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update user", variant: "destructive" });
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
      await deleteUser(selectedUser.id);
      toast({ title: "User deleted!" });
      setDeleteOpen(false);
      loadUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete user", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
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
          <UserRow
            key={user.id}
            user={user}
            isCurrentUser={user.id === session?.user?.id}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>
      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        form={form}
        onChange={handleEditChange}
        onSubmit={handleEditSubmit}
        loading={formLoading}
        onCancel={() => setEditOpen(false)}
      />
      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        loading={deleteLoading}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default AdminPanel; 