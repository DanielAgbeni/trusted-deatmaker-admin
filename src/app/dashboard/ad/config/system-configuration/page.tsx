"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={`relative w-[210px] h-[40px] cursor-pointer rounded overflow-hidden flex items-center select-none transition-colors duration-300 ${
        enabled ? "bg-[#2ecc71]" : "bg-[#e74c3c]"
      }`}
    >
      <div
        className={`absolute top-0 h-full w-[12px] bg-black transition-all duration-300 ${
          enabled ? "left-0" : "right-0"
        }`}
      />
      <div className="absolute inset-0 flex justify-center items-center text-white font-medium text-[15px]">
        {enabled ? "Enabled" : "Disabled"}
      </div>
    </div>
  );
};

export default function SystemConfigurationPage() {
  const [config, setConfig] = useState({
    user_registration: true,
    force_ssl: false,
    agree_policy: false,
    force_secure_password: true,
    kyc_verification: true,
    email_verification: false,
    email_notification: false,
    mobile_verification: true,
    sms_notification: false,
    push_notification: true,
  });

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission - API integration will go here
    console.log("Submitted config:", config);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-[1200px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-900">
          System Configuration
        </h1>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <div className="divide-y divide-gray-100">
              {/* User Registration */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">User Registration</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you disable this module, no one can register on this system.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.user_registration}
                    onChange={() => handleToggle("user_registration")}
                  />
                </div>
              </div>

              {/* Force SSL */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Force SSL</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    By enabling Force SSL (Secure Sockets Layer) the system will force a visitor that he/she must have to visit in secure mode. Otherwise, the site will be loaded in secure mode.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.force_ssl}
                    onChange={() => handleToggle("force_ssl")}
                  />
                </div>
              </div>

              {/* Agree Policy */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Agree Policy</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you enable this module, that means a user must have to agree with your system&apos;s <span className="text-[#0092ca] cursor-pointer hover:underline">policies</span> during registration.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.agree_policy}
                    onChange={() => handleToggle("agree_policy")}
                  />
                </div>
              </div>

              {/* Force Secure Password */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Force Secure Password</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    By enabling this module, a user must set a secure password while signing up or changing the password.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.force_secure_password}
                    onChange={() => handleToggle("force_secure_password")}
                  />
                </div>
              </div>

              {/* KYC Verification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">KYC Verification</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you enable KYC (Know Your Client) module, users must have to submit the required data. Otherwise, any money out transaction will be prevented by this system.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.kyc_verification}
                    onChange={() => handleToggle("kyc_verification")}
                  />
                </div>
              </div>

              {/* Email Verification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Email Verification</h3>
                  <p className="text-[14px] text-gray-500 font-normal leading-relaxed">
                    If you enable Email Verification, users have to verify their email to access the dashboard. A 6-digit verification code will be sent to their email to be verified.
                    <br />
                    <span className="italic text-gray-500">Note: Make sure that the Email Notification module is enabled</span>
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.email_verification}
                    onChange={() => handleToggle("email_verification")}
                  />
                </div>
              </div>

              {/* Email Notification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Email Notification</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you enable this module, the system will send emails to users where needed. Otherwise, no email will be sent. <span className="text-[#ef4444]">So be sure before disabling this module that, the system doesn&apos;t need to send any emails.</span>
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.email_notification}
                    onChange={() => handleToggle("email_notification")}
                  />
                </div>
              </div>

              {/* Mobile Verification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Mobile Verification</h3>
                  <p className="text-[14px] text-gray-500 font-normal leading-relaxed">
                    If you enable Mobile Verification, users have to verify their mobile to access the dashboard. A 6-digit verification code will be sent to their mobile to be verified.
                    <br />
                    <span className="italic text-gray-500">Note: Make sure that the SMS Notification module is enabled</span>
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.mobile_verification}
                    onChange={() => handleToggle("mobile_verification")}
                  />
                </div>
              </div>

              {/* SMS Notification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">SMS Notification</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you enable this module, the system will send SMS to users where needed. Otherwise, no SMS will be sent. <span className="text-[#ef4444]">So be sure before disabling this module that, the system doesn&apos;t need to send any SMS.</span>
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.sms_notification}
                    onChange={() => handleToggle("sms_notification")}
                  />
                </div>
              </div>

              {/* Push Notification */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-1">Push Notification</h3>
                  <p className="text-[14px] text-gray-500 font-normal">
                    If you enable this module, the system will send push notifications to users. Otherwise, no push notification will be sent.
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    enabled={config.push_notification}
                    onChange={() => handleToggle("push_notification")}
                  />
                </div>
              </div>

            </div>

            <div className="p-6 pt-2">
              <Button type="submit" className="w-full bg-[#0092ca] hover:bg-[#007ba8] text-white py-6 text-[16px] font-semibold rounded-[4px] shadow-sm transition-colors">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
