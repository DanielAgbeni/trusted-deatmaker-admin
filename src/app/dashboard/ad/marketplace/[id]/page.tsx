"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Wallet,
  Percent,
  ShieldCheck,
  AlertCircle,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetVendorDetailsQuery, useDeleteEscrowFeeMutation } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

import { ChargeRangeDialog } from "./charge-range-dialog";
import { useState } from "react";

export default function MarketplaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { data: response, isLoading, isError, error, refetch } = useGetVendorDetailsQuery(id);
  const [deleteEscrowFee] = useDeleteEscrowFeeMutation();
  const vendor = response?.data;

  const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const handleEditFee = (fee: any) => {
    setSelectedFee(fee);
    setIsChargeDialogOpen(true);
  };

  const handleAddFee = () => {
    setSelectedFee(null);
    setIsChargeDialogOpen(true);
  };

  const handleDeleteFee = async (feeId: string) => {
    if (window.confirm("Are you sure you want to delete this charge range?")) {
      try {
        await deleteEscrowFee(feeId).unwrap();
        toast.success("Charge range deleted successfully");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete charge range");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-sm text-muted-foreground font-medium">Loading marketplace details...</p>
        </div>
      </div>
    );
  }

  if (isError || !vendor) {
    const errorData = error as any;
    const errorMessage = errorData?.data?.message || "We couldn't retrieve the information for this vendor.";
    const isMisconfigured = errorMessage.includes("misconfigured") || errorMessage.includes("No country assigned");

    return (
      <div className="flex h-[400px] items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isMisconfigured ? 'bg-orange-50' : 'bg-red-50'}`}>
            <AlertCircle className={`h-6 w-6 ${isMisconfigured ? 'text-orange-500' : 'text-red-500'}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{isMisconfigured ? "Vendor Configuration Issue" : "Failed to load details"}</h2>
          <p className="text-muted-foreground">
            {errorMessage}
          </p>
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const { marketplaceInfo, representativeDetails, feeConfigurations } = vendor;

  const stats = [
    { label: "Date Joined", value: marketplaceInfo.dateJoined ? format(new Date(marketplaceInfo.dateJoined), "yyyy-MM-dd hh:mm a") : "N/A", icon: Calendar },
    { label: "ID Number", value: marketplaceInfo.idNumber, icon: CreditCard },
    { label: "Username", value: marketplaceInfo.username, icon: User, color: "text-cyan-600 font-semibold" },
    { label: "Users", value: marketplaceInfo.totalUsers.toLocaleString(), icon: User },
    { label: "Amount", value: `₦${marketplaceInfo.totalVolume.toLocaleString()}`, icon: Wallet },
    { label: "Charge", value: `₦${marketplaceInfo.totalCommissionEarned.toLocaleString()}.00`, icon: Percent },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Listing
          </Button>
          {/* <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Marketplace Details</h1> */}
        </div>
        {/* {marketplaceInfo.active && (
          <Button variant="destructive" className="rounded-xl px-6 h-12 shadow-lg shadow-red-100 flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5" />
            Disable Marketplace
          </Button>
        )} */}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marketplace Information */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-white/20">
          <CardHeader className="bg-white/40 pb-4 border-b border-gray-50 px-8">
            <CardTitle className="text-xl font-bold text-gray-800">Marketplace Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-5">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${stat.color || "text-gray-900"}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                </div>
                <Badge className={`rounded-xl px-3 py-1 bg-green-100 text-green-800 border-green-200`}>
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  {marketplaceInfo.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Representative Details */}
        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-white/20">
          <CardHeader className="bg-white/40 pb-4 border-b border-gray-50 px-8">
            <CardTitle className="text-xl font-bold text-gray-800">Representative Details</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Representative Name</p>
              <p className="text-lg font-extrabold text-gray-900">{representativeDetails.representativeName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">BVN</p>
              <p className="text-lg font-bold text-gray-900 tracking-widest">{representativeDetails.bvn}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Status</p>
              <Badge className="rounded-xl px-3 py-1 bg-green-100 text-green-800 border-green-200">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                {representativeDetails.verificationStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charge Settings Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Charge Settings</h2>

        <Card className="border-none shadow-xl shadow-gray-100/50 rounded-3xl overflow-hidden bg-white pb-6 border border-gray-50">
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50">
            <CardTitle className="text-xl font-bold text-gray-800">Charge Ranges</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-11 w-full md:w-64 rounded-xl border-gray-200 focus:ring-cyan-500"
                />
              </div>
              <Button onClick={handleAddFee} className="h-11 rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 border-none hover:bg-gray-50/50">
                  <TableHead className="w-16 font-semibold py-4 pl-8">SL</TableHead>
                  <TableHead className="font-semibold">Minimum</TableHead>
                  <TableHead className="font-semibold">Maximum</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Fixed Charge</TableHead>
                  <TableHead className="font-semibold">Percent Charge</TableHead>
                  <TableHead className="font-semibold">Charge Cap</TableHead>
                  <TableHead className="font-semibold text-right pr-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeConfigurations && feeConfigurations.length > 0 ? (
                  feeConfigurations
                    .filter((fee: any) => fee.active) // User said "hide the disabled button", interpreting as hiding inactive configs
                    .map((fee: any, index: number) => (
                      <TableRow key={fee.id} className="group border-gray-50 hover:bg-cyan-50/30 transition-colors">
                        <TableCell className="py-5 font-medium pl-8">{index + 1}</TableCell>
                        <TableCell className="font-bold">₦{fee.minAmount.toLocaleString()}</TableCell>
                        <TableCell className="font-bold">₦{fee.maxAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              fee.type === "VENDOR_COMMISSION"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-purple-100 text-purple-700 border-purple-200"
                            }
                          >
                            {fee.type === "VENDOR_COMMISSION" ? "COMMISSION" : "PLATFORM FEE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">₦{fee.flatAmount.toLocaleString()}.00</TableCell>
                        <TableCell className="font-bold">{(fee.percentage * 100).toFixed(0)}%</TableCell>
                        <TableCell className="font-bold">₦{fee.capAmount.toLocaleString()}.00</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditFee(fee)}
                              className="h-8 w-8 rounded-lg border border-gray-100 bg-white shadow-sm hover:text-cyan-600 hover:border-cyan-100 group-hover:scale-110 transition-all"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteFee(fee.id)}
                              className="h-8 w-8 rounded-lg border border-gray-100 bg-white shadow-sm hover:text-red-600 hover:border-red-100 group-hover:scale-110 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No charge ranges configured for this marketplace.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="px-8 py-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
            <p className="text-xs text-muted-foreground">
              {feeConfigurations?.length || 0} of {feeConfigurations?.length || 0} row(s) selected.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Rows per page</span>
                <div className="h-8 w-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">10</div>
              </div>
              <p className="text-xs font-medium text-gray-500">Page 1 of 1</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <Button key={i} variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30" disabled={i > 1}>
                    <MoreHorizontal className="h-3.5 w-3.5 rotate-90" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChargeRangeDialog
        isOpen={isChargeDialogOpen}
        onClose={() => {
          setIsChargeDialogOpen(false);
          refetch();
        }}
        vendorId={id}
        config={selectedFee}
      />
    </div>
  );
}
