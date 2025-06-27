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

import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  role: UserRoleSchema,
  profileImage: z.string().nullable().optional(),
}); 