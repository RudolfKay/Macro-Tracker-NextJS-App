import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

type DashboardFormFieldProps = {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  name?: string;
  children?: React.ReactNode;
};

export const DashboardFormField: React.FC<DashboardFormFieldProps> = ({ label, id, type = "text", value, onChange, required, disabled, placeholder, min, name, children }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
      />
      {children}
    </div>
  </div>
); 