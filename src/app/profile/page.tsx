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

const ProfilePage = () => {
  const { data: session, update } = useSession();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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
  const [formLoading, setFormLoading] = useState(false);
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setIsDefaultAvatar(false);
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/profile/photo", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          toast({ title: "Profile photo updated!" });
          await update();
        } else {
          showApiErrorToast(toast, data.error || "Failed to upload photo");
        }
      } catch (err) {
        showApiErrorToast(toast, err, "Failed to upload photo");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    setUploading(true);
    try {
      const res = await fetch("/api/profile/photo/delete", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Profile photo removed!" });
        setPreview(null);
        await update();
      } else {
        showApiErrorToast(toast, data.error || "Failed to remove photo");
      }
    } catch (err) {
      showApiErrorToast(toast, err, "Failed to remove photo");
    } finally {
      setUploading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Profile updated!" });
        setEditOpen(false);
        await update();
      } else if (res.status === 404) {
        showApiErrorToast(toast, "Profile update endpoint not found (404)");
      } else {
        showApiErrorToast(toast, data.error || "Failed to update profile. Current password is required to confirm changes.");
      }
    } catch (err) {
      showApiErrorToast(toast, err, "Failed to update profile. Current password is required to confirm changes.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="mt-16 flex flex-col items-center justify-center bg-background p-2 sm:p-4">
        <ProfileCard name={session.user.name || ""} email={session.user.email || ""}>
          <ProfilePhoto
            src={(session.user as any)?.profileImage || session.user.image || "/avatar.svg"}
            preview={preview}
            uploading={uploading}
            onClick={handlePhotoClick}
            onFileChange={handleFileChange}
            onRemove={handleRemovePhoto}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            onImageError={handleImageError}
          />
          <Button className="w-full mt-8" variant="outline" onClick={() => setEditOpen(true)}>
            Edit Profile
          </Button>
        </ProfileCard>
        <EditProfileDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          form={form}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          loading={formLoading}
          onCancel={() => setEditOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage; 