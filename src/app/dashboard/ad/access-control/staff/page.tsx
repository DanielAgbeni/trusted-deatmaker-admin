"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, RefreshCw, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useGetAdminsQuery,
    useGetRolesQuery,
    useCreateAdminStaffMutation,
    useUpdateAdminStatusMutation
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { createStaffColumns } from "../../_columns/staff-table-columns";
import { StaffDialog } from "../_components/staff-dialog";
import { AdminStaff } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminStaffPage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<AdminStaff | null>(null);

    // Debouncing search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const activeState = statusFilter === "all" ? undefined : statusFilter === "active";

    const { data: staffData, isLoading, isFetching, refetch } = useGetAdminsQuery({
        search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
        active: activeState,
        startDate: dateRange[0] || undefined,
        endDate: dateRange[1] || undefined,
        page: 0,
        size: 50,
    });

    const { data: rolesData } = useGetRolesQuery();
    const [createStaff, { isLoading: isCreating }] = useCreateAdminStaffMutation();
    const [updateStatus] = useUpdateAdminStatusMutation();

    const handleCreateStaff = async (values: any) => {
        try {
            await createStaff(values).unwrap();
            toast.success("Admin staff created successfully. They will receive an email with their credentials.");
            setIsDialogOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create staff");
        }
    };

    const handleEditStaff = (staff: AdminStaff) => {
        // According to API, we might not have a direct PATCH for staff details yet, 
        // but we can prepare the UI.
        toast.info("Staff detail editing is coming soon.");
        // setSelectedStaff(staff);
        // setIsDialogOpen(true);
    };

    const handleToggleStatus = async (staff: AdminStaff) => {
        try {
            await updateStatus({ id: staff.id, active: !staff.active }).unwrap();
            toast.success(`Staff account ${staff.active ? "deactivated" : "activated"} successfully`);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update status");
        }
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        setDateRange(dateStrings);
    };

    const handleClearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setDateRange(["", ""]);
    };

    const hasFilters = search || statusFilter !== "all" || dateRange[0];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f97316',
                    borderRadius: 8,
                },
            }}
        >
            <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Admin Staff</h1>
                        <p className="text-muted-foreground">Manage internal team members and their system access.</p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedStaff(null);
                            setIsDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 font-medium"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add New Staff
                    </Button>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3 px-6 pt-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10 h-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px] h-10">
                                    <SelectValue placeholder="Status: All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active Only</SelectItem>
                                    <SelectItem value="inactive">Inactive Only</SelectItem>
                                </SelectContent>
                            </Select>

                            <RangePicker
                                value={dateRange[0] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
                                onChange={handleDateChange}
                                className="h-10 border-gray-200"
                                style={{ borderRadius: '8px' }}
                            />

                            {hasFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Clear
                                </Button>
                            )}

                            <div className="flex items-center gap-2 ml-auto">
                                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                {isFetching && !isLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="border-t">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                </div>
                            ) : staffData?.data?.content ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Email</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {staffData.data.content.map((staff) => (
                                                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                                    {/* Implementing cells manually since I don't see a standard DataTable component layout here yet, but I'll use the column definitions logic if possible. Actually, better to just implement the table structure if DataTable is unsure. But users usually have a reusable one. Let's assume a simplified structure for now or use the column definitions manually. */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{`${staff.firstName} ${staff.lastName}`}</span>
                                                            <span className="text-xs text-muted-foreground">{staff.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 italic">
                                                            {staff.role.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${staff.active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                            }`}>
                                                            {staff.active ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {staff.lastLoginDate ? new Date(staff.lastLoginDate).toLocaleDateString() : "Never"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleToggleStatus(staff)}
                                                        >
                                                            {staff.active ? "Deactivate" : "Activate"}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                    <p>No admin staff found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <StaffDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={handleCreateStaff}
                    staff={selectedStaff}
                    roles={rolesData?.data || []}
                    isLoading={isCreating}
                />
            </div>
        </ConfigProvider>
    );
}
