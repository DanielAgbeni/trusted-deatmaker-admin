"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Eye, EyeOff, Upload, X, Plus, Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useInviteUserMutation, useInviteUsersBulkMutation } from "@/lib/store/features/vendorDashboardApi/vendorDashboardApi";
import Papa from "papaparse";

interface InviteUserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isoCountryCode: string;
}

interface CSVRow {
  email: string;
  first_name?: string;
  firstname?: string;
  firstName?: string;
  last_name?: string;
  lastname?: string;
  lastName?: string;
  phone?: string;
  phone_number?: string;
  phoneNumber?: string;
  country?: string;
  country_code?: string;
  isoCountryCode?: string;
  iso_country_code?: string;
}

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [inviteLink, setInviteLink] = useState("");
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [userList, setUserList] = useState<InviteUserData[]>([]);
  const [newUser, setNewUser] = useState<Partial<InviteUserData>>({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    isoCountryCode: "US"
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // RTK Query mutations
  const [inviteUser] = useInviteUserMutation();
  const [inviteUsersBulk] = useInviteUsersBulkMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateInviteLink = async () => {
    // Note: The API might not have a direct invite link endpoint
    // This could be handled differently based on your backend
    try {
      toast.info("Generating invite link...");
      // Simulate API call or generate a static link
      const generatedLink = `https://trusteddealmaker.com/invite/${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      setInviteLink(generatedLink);
      setShowInviteLink(true);
      toast.success("Invite link generated", {
        description: "You can now copy the invite link.",
      });
    } catch (error) {
      toast.error("Failed to generate link");
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      toast.success("Link copied", {
        description: "Invite link has been copied to clipboard.",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy the invite link.",
      });
    }
  };

  const addUser = () => {
    if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.phoneNumber) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Check if email already exists
    if (userList.some(user => user.email === newUser.email)) {
      toast.error("Duplicate email", {
        description: "This email is already in the list.",
      });
      return;
    }

    const userToAdd: InviteUserData = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      isoCountryCode: newUser.isoCountryCode || "US"
    };

    setUserList([...userList, userToAdd]);
    setNewUser({
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      isoCountryCode: "US"
    });
    
    toast.success("User added", {
      description: "User has been added to the invite list.",
    });
  };

  const removeUser = (email: string) => {
    setUserList(userList.filter(user => user.email !== email));
    toast.info("User removed", {
      description: "User has been removed from the list.",
    });
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast.error("Invalid file", {
        description: "Please upload a valid CSV file.",
      });
      return;
    }

    setCsvFile(file);

    // Parse CSV file
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newUsers: InviteUserData[] = [];
        const errors: string[] = [];

        results.data.forEach((row, index) => {
          try {
            const email = row.email?.trim();
            const firstName = row.first_name || row.firstname || row.firstName || "";
            const lastName = row.last_name || row.lastname || row.lastName || "";
            const phoneNumber = row.phone || row.phone_number || row.phoneNumber || "";
            const isoCountryCode = row.country_code || row.iso_country_code || row.isoCountryCode || "US";

            if (!email) {
              errors.push(`Row ${index + 1}: Missing email`);
              return;
            }

            if (!firstName) {
              errors.push(`Row ${index + 1}: Missing first name`);
              return;
            }

            if (!lastName) {
              errors.push(`Row ${index + 1}: Missing last name`);
              return;
            }

            if (!phoneNumber) {
              errors.push(`Row ${index + 1}: Missing phone number`);
              return;
            }

            newUsers.push({
              email,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phoneNumber: phoneNumber.trim(),
              isoCountryCode: isoCountryCode.trim().toUpperCase(),
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: Invalid data format`);
          }
        });

        // Filter out duplicates from existing list
        const existingEmails = new Set(userList.map(user => user.email.toLowerCase()));
        const uniqueNewUsers = newUsers.filter(
          user => !existingEmails.has(user.email.toLowerCase())
        );

        if (uniqueNewUsers.length > 0) {
          setUserList([...userList, ...uniqueNewUsers]);
          toast.success("CSV parsed successfully", {
            description: `Added ${uniqueNewUsers.length} new users from CSV.`,
          });
        } else {
          toast.info("No new users", {
            description: "All users in CSV are already in the list.",
          });
        }

        if (errors.length > 0) {
          toast.warning("Some errors occurred", {
            description: `${errors.length} rows had issues. Check the CSV format.`,
            duration: 5000,
          });
        }
      },
      error: (error) => {
        toast.error("CSV parsing failed", {
          description: "Could not parse the CSV file.",
        });
      },
    });
  };

  const downloadCSVTemplate = () => {
    const headers = ["email", "first_name", "last_name", "phone_number", "country_code"];
    const example = ["john.doe@example.com", "John", "Doe", "+1234567890", "US"];
    
    const csvContent = [headers, example]
      .map(row => row.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user_invite_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.info("Template downloaded", {
      description: "CSV template has been downloaded.",
    });
  };

  const sendInvites = async () => {
    if (activeTab === "email" && userList.length === 0) {
      toast.error("No users to invite", {
        description: "Please add at least one user to invite.",
      });
      return;
    }

    setIsSending(true);

    try {
      if (activeTab === "email") {
        if (userList.length === 1) {
          // Send single invite
          const user = userList[0];
          const result = await inviteUser(user).unwrap();
          
          if (result.success) {
            toast.success("Invite sent", {
              description: `Invitation sent to ${user.email}`,
            });
            setUserList([]);
          } else {
            throw new Error(result.message || "Failed to send invite");
          }
        } else {
          // Send bulk invites
          const result = await inviteUsersBulk({ users: userList }).unwrap();
          
          if (result.success) {
            toast.success("Bulk invites sent", {
              description: `Successfully sent ${result.data?.successful || 0} invites. ${result.data?.failed || 0} failed.`,
              duration: 5000,
            });
            setUserList([]);
          } else {
            throw new Error(result.message || "Failed to send bulk invites");
          }
        }
      } else {
        // For invite link tab
        toast.success("Invite ready", {
          description: "Invite link is ready to be shared.",
        });
      }

      // Close dialog after successful send
      setTimeout(() => {
        setOpen(false);
        setIsSending(false);
        setInviteLink("");
        setShowInviteLink(false);
      }, 1000);

    } catch (error: any) {
      console.error("Invite error:", error);
      toast.error("Failed to send invites", {
        description: error?.data?.message || error?.message || "Please try again",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addUser();
    }
  };

  const handleInputChange = (field: keyof InviteUserData, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Invite New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="bg-cyan-500 text-white p-6 rounded-t-lg flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold text-center">
            Invite New User
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="link">Invite Link</TabsTrigger>
              <TabsTrigger value="email">Email Invites</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-gray-700">
                    Invite link
                  </Label>
                  <Button
                    onClick={generateInviteLink}
                    variant="link"
                    className="text-cyan-500 hover:text-cyan-600 p-0 h-auto font-medium"
                    disabled={isSending}
                  >
                    {inviteLink ? "Regenerate" : "Generate"} Invite link
                  </Button>
                </div>

                <div className="relative">
                  <Input
                    type={showInviteLink ? "text" : "password"}
                    value={inviteLink}
                    placeholder="Generated invite link will appear here"
                    readOnly
                    className="pr-20 bg-gray-50"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowInviteLink(!showInviteLink)}
                    >
                      {showInviteLink ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    {inviteLink && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={copyInviteLink}
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-6">
                {/* CSV Upload Section */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-gray-700">
                    Upload CSV File
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                        disabled={isSending}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload CSV</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={downloadCSVTemplate}
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                    {csvFile && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 truncate">
                          {csvFile.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCsvFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Entry Section */}
                <div className="border-t pt-4">
                  <Label className="text-base font-medium text-gray-700 mb-3 block">
                    Add Users Manually
                  </Label>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={newUser.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={newUser.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={newUser.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={newUser.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={addUser}
                      variant="link"
                      className="text-cyan-500 hover:text-cyan-600 p-0 h-auto font-medium"
                      disabled={isSending}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add User to List
                    </Button>
                  </div>

                  {/* User List Display */}
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base font-medium text-gray-700">
                        Users to Invite ({userList.length})
                      </Label>
                      {userList.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserList([])}
                          className="text-red-500 hover:text-red-600"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {userList.length === 0 ? (
                        <div className="h-[150px] flex items-center justify-center">
                          <p className="text-gray-500 text-sm text-center">
                            No users added yet. Add users manually or upload a CSV.
                          </p>
                        </div>
                      ) : (
                        userList.map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.email}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {user.firstName} {user.lastName} • {user.phoneNumber}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2 shrink-0"
                              onClick={() => removeUser(user.email)}
                              disabled={isSending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-auto p-6 pt-4 border-t flex-shrink-0">
          <Button
            onClick={sendInvites}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-medium"
            disabled={isSending || (activeTab === "email" && userList.length === 0)}
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              `Send Invite${activeTab === "email" && userList.length > 1 ? "s" : ""} →`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}