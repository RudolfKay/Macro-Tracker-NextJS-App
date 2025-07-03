import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { RefObject } from "react";

type ProfilePhotoProps = {
  src: string;
  preview: string | null;
  uploading: boolean;
  onClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onImageError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
};

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ src, preview, uploading, onClick, onFileChange, onRemove, fileInputRef, onImageError }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center w-[112px] h-[140px] sm:w-[140px] sm:h-[160px]">
      {/* Clickable avatar area */}
      <div
        className="group cursor-pointer bg-white dark:bg-neutral-400 rounded-full w-[112px] h-[112px] sm:w-[140px] sm:h-[140px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
        onClick={onClick}
        tabIndex={0}
        aria-label="Change profile photo"
        role="button"
        onKeyDown={handleKeyDown}
      >
        <Image
          src={preview || src}
          alt="Profile photo"
          width={111}
          height={111}
          className={"drop-shadow-md rounded-full border-4 border-emerald-400 dark:border-emerald-600 shadow-md object-cover object-center transition opacity-80 group-hover:opacity-100 w-[112px] h-[112px] sm:w-[140px] sm:h-[140px]"}
          onError={onImageError}
          tabIndex={0}
          aria-label="User profile photo"
          priority
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onFileChange}
        />
        <span className="absolute bottom-0 right-0 bg-emerald-400 dark:bg-emerald-600 text-white text-xs rounded-full px-2 py-1 opacity-80 group-hover:opacity-100 transition">Change</span>
      </div>
      {/* Remove Photo button, visually overlaid but not a child of clickable area */}
      <Button
        variant="ghost"
        className="mt-4 sm:mt-2 text-xs text-red-600 hover:text-red-700 absolute left-1/2 -bottom-14 sm:-bottom-12 -translate-x-1/2 z-10"
        onClick={e => { e.stopPropagation(); onRemove(); }}
        disabled={uploading}
        tabIndex={0}
        aria-label="Remove photo"
      >
        Remove Photo
      </Button>
    </div>
  );
}; 