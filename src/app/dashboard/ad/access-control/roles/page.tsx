"use client";

import React, { useState } from "react";
import { Plus, Shield, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useGetRolesQuery,
    useGetPermissionsQuery,
    useCreateRoleMutation
} from "@/lib/store/features/adminDashboardApi/adminDashboardApi";
import { RoleDialog } from "../_components/role-dialog";
import { AdminRole } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RolesPermissionsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

    const { data: rolesData, isLoading, isFetching, refetch } = useGetRolesQuery();
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
        toast.info("Role editing is coming soon.");
        // setSelectedRole(role);
        // setIsDialogOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Roles & Permissions</h1>
                    <p className="text-muted-foreground">Define system roles and assign granular permissions.</p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedRole(null);
                        setIsDialogOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 font-medium"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create New Role
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rolesData?.data?.map((role) => (
                        <Card key={role.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                                        Edit
                                    </Button>
                                </div>
                                <CardTitle className="mt-4 text-lg">{role.name}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">{role.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {role.permissions.map((perm) => (
                                            <Badge key={perm} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px] py-0 px-2">
                                                {perm.replace(/_/g, ' ')}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Created {new Date(role.createdAt).toLocaleDateString()}</span>
                                        <span>{role.permissions.length} Permissions</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {rolesData?.data?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground bg-white rounded-lg border border-dashed">
                            <Shield className="h-10 w-10 mb-2 opacity-20" />
                            <p>No custom roles defined yet.</p>
                            <Button variant="link" onClick={() => setIsDialogOpen(true)}>Create your first role</Button>
                        </div>
                    )}
                </div>
            )}

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
