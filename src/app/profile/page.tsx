"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/auth/protected-route";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          toast({ title: "Error", description: data.error || "Failed to upload photo", variant: "destructive" });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to upload photo", variant: "destructive" });
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
        toast({ title: "Error", description: data.error || "Failed to remove photo", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove photo", variant: "destructive" });
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
        toast({ title: "Error", description: "Profile update endpoint not found (404)", variant: "destructive" });
      } else {
        toast({ title: "Error", description: data.error || "Failed to update profile. Current password is required to confirm changes.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update profile. Current password is required to confirm changes.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md mx-auto mb-4 flex justify-start">
          <Link href="/dashboard" className="text-emerald-600 hover:underline font-medium">&larr; Back to Dashboard</Link>
        </div>
        <Card className="w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick} tabIndex={0} aria-label="Change profile photo">
              <Image
                src={preview || (session.user as any)?.profileImage || session.user.image || "/avatar.svg"}
                alt="Profile photo"
                width={111}
                height={111}
                className={`rounded-full border-4 border-emerald-200 shadow-md object-cover object-center transition group-hover:opacity-80 w-[111px] h-[111px]${isDefaultAvatar ? " opacity-50" : ""}`}
                onError={handleImageError}
                tabIndex={0}
                aria-label="User profile photo"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-xs rounded-full px-2 py-1 opacity-80 group-hover:opacity-100 transition">Change</span>
            </div>
            <Button
              variant="ghost"
              className="mt-2 text-xs text-red-600 hover:text-red-700"
              onClick={handleRemovePhoto}
              disabled={uploading}
            >
              Remove Photo
            </Button>
            <CardTitle className="mt-4 text-2xl">{session.user.name}</CardTitle>
            <p className="text-muted-foreground">{session.user.email}</p>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center gap-4">
            <Button className="w-full max-w-xs" variant="outline" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
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
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" value={form.newPassword} onChange={handleEditChange} minLength={6} disabled={formLoading} placeholder="Leave blank to keep current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={handleEditChange} required disabled={formLoading} />
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
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage; 