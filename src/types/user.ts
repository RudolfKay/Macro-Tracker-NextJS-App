/**
 * User roles in the system.
 */
export type UserRole = "USER" | "ADMIN";

/**
 * User model.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: UserRole;
  profileImage?: string | null;
} 