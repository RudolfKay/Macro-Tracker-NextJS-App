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
import { showApiErrorToast } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminPanel = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "USER" as User["role"] });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users with React Query
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
    enabled: status !== "loading" && !!session && session.user.role === "ADMIN",
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (user: { id: string; name: string; email: string; role: User["role"] }) => updateUser(user),
    onSuccess: () => {
      toast({ title: "User updated!" });
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => {
      showApiErrorToast(toast, err, "Failed to update user");
    },
    onSettled: () => setFormLoading(false),
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast({ title: "User deleted!" });
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: any) => {
      showApiErrorToast(toast, err, "Failed to delete user");
    },
    onSettled: () => setDeleteLoading(false),
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    // No need to manually load users; useQuery handles it
    // eslint-disable-next-line
  }, [session, status, router]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, role: e.target.value as User["role"] });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    updateUserMutation.mutate({ id: selectedUser.id, name: form.name, email: form.email, role: form.role });
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    deleteUserMutation.mutate(selectedUser.id);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-500">{error?.message || "Failed to load users"}</div>;

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 sm:mt-10 p-2 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Button asChild variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
          <Link href="/dashboard" aria-label="Back to Dashboard">
            <span aria-hidden="true">&larr;</span> Dashboard
          </Link>
        </Button>
        <span className="text-xl sm:text-2xl font-bold text-center w-full sm:w-auto">Admin Panel</span>
      </div>
      <div>
        {(users ?? []).map((user: User) => (
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
        onRoleChange={handleRoleChange}
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