export type UserType = "regular" | "marketplace";
export type AuthMode = "signin" | "signup";

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  fieldName?: string; // Maps to API field name
}

export interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status: number;
}

// Form configurations
export const formConfigs: Record<UserType, Record<AuthMode, FormField[]>> = {
  regular: {
    signin: [
      {
        id: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
        fieldName: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
        fieldName: "password",
      },
    ],
    signup: [
      {
        id: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "John",
        required: true,
        fieldName: "firstName",
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Doe",
        required: true,
        fieldName: "lastName",
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
        fieldName: "email",
      },
      {
        id: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 (555) 123-4567",
        required: true,
        fieldName: "phoneNumber",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "8+ characters with special characters",
        required: true,
        fieldName: "password",
      },
      {
        id: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm your password",
        required: true,
      },
    ],
  },
  marketplace: {
    signin: [
      {
        id: "email",
        label: "Email Address",
        type: "email",
        placeholder: "business@example.com",
        required: true,
        fieldName: "email",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
        fieldName: "password",
      },
    ],
    signup: [
      {
        id: "firstname",
        label: "First Name",
        type: "text",
        placeholder: "John",
        required: true,
        fieldName: "firstname",
      },
      {
        id: "lastname",
        label: "Last Name",
        type: "text",
        placeholder: "Doe",
        required: true,
        fieldName: "lastname",
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        placeholder: "business@example.com",
        required: true,
        fieldName: "email",
      },
      {
        id: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 (555) 123-4567",
        required: true,
        fieldName: "phoneNumber",
      },
      {
        id: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "Your Business Name",
        required: true,
        fieldName: "businessName",
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "8+ characters with special characters",
        required: true,
        fieldName: "password",
      },
      {
        id: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm your password",
        required: true,
      },
    ],
  },
};