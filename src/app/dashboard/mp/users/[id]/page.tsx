import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

// Types for better reusability
export interface UserPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryCode?: string;
}

export interface UserAddressInfo {
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserVerificationStatus {
  label: string;
  status: string;
  verified: boolean;
}

export interface UserInfoData {
  personalInfo: UserPersonalInfo;
  addressInfo: UserAddressInfo;
  verificationStatus: UserVerificationStatus[];
}

// Generic Input Field Component
interface InfoFieldProps {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel";
  prefix?: ReactNode;
  className?: string;
  readOnly?: boolean;
}

const InfoField = ({
  id,
  label,
  value,
  type = "text",
  prefix,
  className = "",
  readOnly = true,
}: InfoFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label}
    </Label>
    <div className="flex">
      {prefix && (
        <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md">
          {prefix}
        </div>
      )}
      <Input
        id={id}
        type={type}
        defaultValue={value}
        className={`bg-gray-50 border-gray-200 ${
          prefix ? "rounded-l-none" : ""
        } ${className}`}
        readOnly={readOnly}
      />
    </div>
  </div>
);

// Personal Information Section
interface PersonalInfoSectionProps {
  personalInfo: UserPersonalInfo;
  readOnly?: boolean;
}

const PersonalInfoSection = ({
  personalInfo,
  readOnly = true,
}: PersonalInfoSectionProps) => (
  <>
    {/* First Row - Name */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoField
        id="firstName"
        label="First Name"
        value={personalInfo.firstName}
        readOnly={readOnly}
      />
      <InfoField
        id="lastName"
        label="Last Name"
        value={personalInfo.lastName}
        readOnly={readOnly}
      />
    </div>

    {/* Second Row - Contact */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoField
        id="email"
        label="Email"
        value={personalInfo.email}
        type="email"
        readOnly={readOnly}
      />
      <InfoField
        id="mobile"
        label="Mobile Number"
        value={personalInfo.mobile}
        type="tel"
        prefix={
          <span className="text-sm text-gray-600">
            {personalInfo.countryCode || "+234"}
          </span>
        }
        readOnly={readOnly}
      />
    </div>
  </>
);

// Address Information Section
interface AddressInfoSectionProps {
  addressInfo: UserAddressInfo;
  readOnly?: boolean;
}

const AddressInfoSection = ({
  addressInfo,
  readOnly = true,
}: AddressInfoSectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <InfoField
      id="city"
      label="City"
      value={addressInfo.city}
      readOnly={readOnly}
    />
    <InfoField
      id="state"
      label="State"
      value={addressInfo.state}
      readOnly={readOnly}
    />
    <InfoField
      id="zipCode"
      label="Zip/Postal Code"
      value={addressInfo.zipCode}
      readOnly={readOnly}
    />
    <InfoField
      id="country"
      label="Country"
      value={addressInfo.country}
      readOnly={readOnly}
    />
  </div>
);

// Verification Status Section
interface VerificationStatusSectionProps {
  verificationStatus: UserVerificationStatus[];
}

const VerificationStatusSection = ({
  verificationStatus,
}: VerificationStatusSectionProps) => (
  <div className="pt-6 border-t border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {verificationStatus.map((item, index) => (
        <div key={index} className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {item.label}
          </Label>
          <Badge
            variant={item.verified ? "default" : "destructive"}
            className={`w-full justify-center py-2 text-sm font-medium ${
              item.verified
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {item.status}
          </Badge>
        </div>
      ))}
    </div>
  </div>
);

// Main Reusable User Information Component
interface UserInformationCardProps {
  userInfo: UserInfoData;
  title?: string;
  showCard?: boolean;
  readOnly?: boolean;
  className?: string;
}

const UserInformationCard = ({
  userInfo,
  title = "User Information",
  showCard = true,
  readOnly = true,
  className = "",
}: UserInformationCardProps) => {
  const content = (
    <div className={`space-y-6 ${showCard ? "" : "px-0"} ${className}`}>
      <PersonalInfoSection
        personalInfo={userInfo.personalInfo}
        readOnly={readOnly}
      />
      <AddressInfoSection
        addressInfo={userInfo.addressInfo}
        readOnly={readOnly}
      />
      <VerificationStatusSection
        verificationStatus={userInfo.verificationStatus}
      />
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card className="border-0 shadow-none px-0 w-full">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">{content}</CardContent>
    </Card>
  );
};

// Updated User Details Page using the reusable component
import { notFound } from "next/navigation";
import {
  CurrencyStatCard,
  GeneralStatCard,
  StatCard,
} from "@/components/dashboard/stats-card";

// Updated User interface
interface User {
  id: string;
  stats: {
    title: string;
    value: string;
    change?: { value: string; trend: "up" | "down" | "neutral" };
  }[];
  userInfo: UserInfoData;
}

// Updated getUserDetails function
const getUserDetails = (id: string): User | null => {
  return {
    id: id,
    stats: [
      {
        title: "Balance",
        value: "855000",
      },
      {
        title: "Deposits",
        value: "277500",
        change: { value: "+15.03%", trend: "up" as const },
      },
      {
        title: "Withdrawals",
        value: "400000",
        change: { value: "+6.08%", trend: "up" as const },
      },
      {
        title: "Transactions",
        value: "120",
        change: { value: "0%", trend: "neutral" as const },
      },
    ],
    userInfo: {
      personalInfo: {
        firstName: "David",
        lastName: "Afolabi",
        email: "davidaboiaji012691@google.com",
        mobile: "8012345678",
        countryCode: "+234",
      },
      addressInfo: {
        city: "Lagos",
        state: "Lagos State",
        zipCode: "100001",
        country: "Nigeria",
      },
      verificationStatus: [
        { label: "Email Verification", status: "Verified", verified: true },
        { label: "Mobile Verification", status: "Verified", verified: true },
        { label: "2FA Verification", status: "Disabled", verified: false },
        { label: "KYC", status: "Verified", verified: true },
      ],
    },
  };
};

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = id.startsWith("#") ? id.substring(1) : id;
  const user = getUserDetails(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="container p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">User Details - {user.id}</h1>

      <section className="flex flex-col items-start justify-between gap-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-start">
          {user.stats.slice(0, 3).map((stat, index) => (
            <CurrencyStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              index={index}
            />
          ))}
          {user.stats.slice(3, 4).map((stat, index) => (
            <GeneralStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              index={index}
            />
          ))}
        </div>

        {/* Reusable User Information Component */}
        <UserInformationCard userInfo={user.userInfo} />
      </section>
    </div>
  );
}

export const generateStaticParams = async () => {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
    { id: "10" },
  ];
};
