"use client";

import React, { useState, useMemo } from "react";
import { Plus, Shield, RefreshCw, Loader2, Search, FileText, LayoutTemplate, History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useCreateRoleMutation
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { RoleDialog } from "../_components/role-dialog";
import { AdminRole } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryTable } from "@/components/dashboard/tables";
import { createRoleColumns } from "../../_columns/roles-table-columns";
import { RolesStats } from "./_components/roles-stats";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function RolesPermissionsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: rolesData, isLoading, refetch } = useGetRolesQuery();
    const { data: permissionsData } = useGetPermissionsQuery();
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

    const handleCreateRole = async (values: any) => {
        try {
            await createRole(values).unwrap();
            toast.success("Role created successfully.");
            setIsDialogOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create role");
        }
    };

    const handleEditRole = (role: AdminRole) => {
        setSelectedRole(role);
        setIsDialogOpen(true);
    };

    const handleDeleteRole = (role: AdminRole) => {
        toast.error(`Delete functionality for ${role.name} is coming soon.`);
    };

    const columns = useMemo(() =>
        createRoleColumns(handleEditRole, handleDeleteRole),
        [rolesData]);

    const filteredRoles = useMemo(() => {
        if (!rolesData?.data) return [];
        return rolesData.data.filter(role =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rolesData, searchTerm]);

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
            {/* Breadcrumbs & Header */}
            <div className="space-y-4">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 font-outfit">Roles & Permissions Management</h1>
                        <p className="text-gray-500 max-w-2xl leading-relaxed">
                            Control system access by defining granular roles. Assign specific permissions to ensure security and organizational efficiency.
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <RolesStats
                totalRoles={rolesData?.data?.length || 0}
                totalPermissions={permissionsData?.data?.length || 0}
            />

            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/50 p-4 rounded-2xl border border-gray-100 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={() => {
                            setSelectedRole(null);
                            setIsDialogOpen(true);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 shadow-lg shadow-cyan-100"
                    >
                        <Plus className="mr-2 h-4.5 w-4.5" /> Create New Role
                    </Button>
                    <Button variant="outline" className="font-semibold border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 text-cyan-600" />
                        Role Templates
                    </Button>
                    <Button variant="outline" className="font-semibold border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        Audit Report
                    </Button>
                </div>

                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                        placeholder="Search roles..."
                        className="pl-10 h-11 border-gray-200 focus:ring-cyan-500 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Table Area */}
            <Card className="border-none shadow-xl shadow-gray-100/50 overflow-hidden ring-1 ring-gray-100">
                <CardContent className="p-0">
                    <HistoryTable
                        columns={columns}
                        data={filteredRoles}
                        isLoading={isLoading}
                        emptyState={
                            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                                <div className="p-6 bg-gray-50 rounded-full">
                                    <Shield className="w-12 h-12 text-gray-200" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900">No roles match your search</h3>
                                    <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                                </div>
                                <Button variant="link" onClick={() => setSearchTerm("")}>Clear search</Button>
                            </div>
                        }
                    />
                </CardContent>
            </Card>

            {/* Quick Tip Footer */}
            {/* <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-200 shrink-0">
                    <Info className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-900 leading-none">Quick Tip:</p>
                    <p className="text-sm text-blue-800/80">
                        Click <span className="font-bold underline decoration-blue-300">"Edit"</span> to modify role permissions, <span className="font-bold underline decoration-blue-300">"Clone"</span> to create a similar role, or <span className="font-bold underline decoration-blue-300">"Create New Role"</span> to start from scratch. All changes are logged and require approval for Level 3+ roles.
                    </p>
                </div>
            </div> */}

            {/* Role Management Dialog */}
            <RoleDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleCreateRole}
                role={selectedRole}
                availablePermissions={permissionsData?.data || []}
                isLoading={isCreating}
            />
        </div>
    );
}
