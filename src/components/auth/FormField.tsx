import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

type FormFieldProps = {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({ label, id, name, type = "text", value, onChange, required, disabled, placeholder, children }) => (
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
      />
      {children}
    </div>
  </div>
); 