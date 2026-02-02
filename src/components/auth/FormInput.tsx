"use client";
import type { FormField } from "./types";

interface FormInputProps {
  field: FormField;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function FormInput({
  field,
  showPassword,
  onTogglePassword,
  value,
  onChange,
  error,
}: FormInputProps) {
  const isPasswordField = field.type === "password";

  return (
    <div className="mb-4">
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {field.label}
      </label>
      <div className="relative">
        <input
          type={isPasswordField && showPassword ? "text" : field.type}
          id={field.id}
          name={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={`w-full px-3 py-2.5 border rounded-md shadow-sm text-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${isPasswordField ? "pr-10" : ""}`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Toggle password visibility</span>
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}