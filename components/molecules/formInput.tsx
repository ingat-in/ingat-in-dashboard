import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  helpText,
  icon,
  className,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-zinc-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${icon ? "pl-10" : ""} ${className || ""} border-zinc-300 focus:border-blue-500`}
          required={required}
        />
      </div>
      {helpText && <p className="text-xs text-zinc-500">{helpText}</p>}
    </div>
  );
}
