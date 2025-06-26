import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { RefObject } from "react";

type ProfilePhotoProps = {
  src: string;
  preview: string | null;
  isDefault: boolean;
  uploading: boolean;
  onClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onImageError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ src, preview, isDefault, uploading, onClick, onFileChange, onRemove, fileInputRef, onImageError }) => (
  <div className="relative group cursor-pointer bg-white dark:bg-white rounded-full w-[111px] h-[111px] flex items-center justify-center" onClick={onClick} tabIndex={0} aria-label="Change profile photo">
    <Image
      src={preview || src}
      alt="Profile photo"
      width={111}
      height={111}
      className={`rounded-full border-4 border-emerald-400 shadow-md object-cover object-center transition group-hover:opacity-80 w-[111px] h-[111px]${isDefault ? " opacity-50" : ""}`}
      onError={onImageError}
      tabIndex={0}
      aria-label="User profile photo"
    />
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      className="hidden"
      onChange={onFileChange}
    />
    <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-xs rounded-full px-2 py-1 opacity-80 group-hover:opacity-100 transition">Change</span>
    <Button
      variant="ghost"
      className="mt-2 text-xs text-red-600 hover:text-red-700 absolute left-1/2 -bottom-8 -translate-x-1/2"
      onClick={onRemove}
      disabled={uploading}
      tabIndex={0}
      aria-label="Remove photo"
    >
      Remove Photo
    </Button>
  </div>
); 