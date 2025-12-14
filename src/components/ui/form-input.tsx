import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className={cn(error && "text-red-500")}>
        {label}
      </Label>

      <Input
        id={id}
        className={cn(
          className,
          error && "border-red-500 focus-visible:ring-red-500"
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
