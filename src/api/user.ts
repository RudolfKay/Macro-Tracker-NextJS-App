import type { User, UserRole } from "@/types/user";

/** Fetch all users (admin only) */
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/admin/users");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch users");
  return data;
}

/** Update a user (admin only) */
export async function updateUser(user: { id: string; name: string; email: string; role: UserRole }): Promise<User> {
  const res = await fetch("/api/admin/users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update user");
  return data;
}

/** Delete a user (admin only) */
export async function deleteUser(id: string): Promise<boolean> {
  const res = await fetch("/api/admin/users", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete user");
  return data.success;
} 