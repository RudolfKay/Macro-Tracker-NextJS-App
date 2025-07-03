"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfilePhoto } from "@/components/profile/ProfilePhoto";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { showApiErrorToast } from "@/lib/utils";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    newPassword: "",
    currentPassword: "",
  });
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(false);
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  // React Query mutations
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload photo");
      return data;
    },
    onSuccess: async () => {
      toast({ title: "Profile photo updated!" });
      setPreview(null);
      await update();
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      showApiErrorToast(toast, err, "Failed to upload photo");
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/profile/photo/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove photo");
      return data;
    },
    onSuccess: async () => {
      toast({ title: "Profile photo removed!" });
      setPreview(null);
      await update();
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      showApiErrorToast(toast, err, "Failed to remove photo");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (form: { name: string; email: string; newPassword: string; currentPassword: string }) => {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      return data;
    },
    onSuccess: async () => {
      toast({ title: "Profile updated!" });
      setEditOpen(false);
      await update();
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      showApiErrorToast(toast, err, "Failed to update profile. Current password is required to confirm changes.");
    },
  });

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({
        ...f,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session?.user]);

  useEffect(() => {
    // Determine if the current image is the default avatar
    const hasCustomImage = !!(preview || (session?.user as any)?.profileImage || session?.user?.image);
    setIsDefaultAvatar(!hasCustomImage);
  }, [preview, session?.user]);

  if (!session?.user) return null;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = "/avatar.svg";
    setIsDefaultAvatar(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setIsDefaultAvatar(false);
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleRemovePhoto = () => {
    deletePhotoMutation.mutate();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenEdit = () => {
    setForm(f => ({
      ...f,
      newPassword: "",
      currentPassword: "",
    }));
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setForm(f => ({
      ...f,
      newPassword: "",
      currentPassword: "",
    }));
    setFormError(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only validate newPassword if present
    if (form.newPassword && form.newPassword.length < 6) {
      setFormError("New password must be at least 6 characters long.");
      return;
    }
    setFormError(null);
    updateProfileMutation.mutate(form, {
      onSuccess: () => {
        handleCloseEdit();
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="mt-16 flex flex-col items-center justify-center bg-background p-2 sm:p-4">
        <ProfileCard name={session.user.name || ""} email={session.user.email || ""}>
          <ProfilePhoto
            src={(session.user as any)?.profileImage || session.user.image || "/avatar.svg"}
            preview={preview}
            uploading={uploadPhotoMutation.isPending || deletePhotoMutation.isPending}
            onClick={handlePhotoClick}
            onFileChange={handleFileChange}
            onRemove={handleRemovePhoto}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            onImageError={handleImageError}
          />
          <Button className="w-full mt-8" variant="outline" onClick={handleOpenEdit}>
            Edit Profile
          </Button>
        </ProfileCard>
        <EditProfileDialog
          open={editOpen}
          onOpenChange={open => open ? handleOpenEdit() : handleCloseEdit()}
          form={form}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          loading={updateProfileMutation.isPending}
          onCancel={handleCloseEdit}
        />
        {formError && (
          <div className="text-red-600 text-sm text-center mt-2">{formError}</div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage; 