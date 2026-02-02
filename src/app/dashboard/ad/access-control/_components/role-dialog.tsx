"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminRole } from "@/lib/store/features/adminDashboardApi/adminDashboardTypes";
import { Loader2, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const roleSchema = z.z.object({
    name: z.string().min(3, "Role name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoleFormValues) => void;
    role?: AdminRole | null;
    availablePermissions: string[];
    isLoading?: boolean;
}

export function RoleDialog({
    isOpen,
    onClose,
    onSubmit,
    role,
    availablePermissions,
    isLoading,
}: RoleDialogProps) {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    });

    useEffect(() => {
        if (role) {
            form.reset({
                name: role.name,
                description: role.description,
                permissions: role.permissions,
            });
        } else {
            form.reset({
                name: "",
                description: "",
                permissions: [],
            });
        }
    }, [role, form, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        {role ? "Edit Role" : "Create Dynamic Role"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-hidden flex flex-col">
                        <div className="space-y-4 px-1">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Finance Manager" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the responsibilities of this role..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex-1 flex flex-col min-h-[200px] overflow-hidden">
                            <FormLabel className="mb-2 px-1">Permissions</FormLabel>
                            <ScrollArea className="flex-1 border rounded-md p-4">
                                <FormField
                                    control={form.control}
                                    name="permissions"
                                    render={() => (
                                        <FormItem>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {availablePermissions.map((permission) => (
                                                    <FormField
                                                        key={permission}
                                                        control={form.control}
                                                        name="permissions"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={permission}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(permission)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, permission])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== permission
                                                                                        )
                                                                                    );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                                                        {permission.replace(/_/g, ' ')}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </ScrollArea>
                            <FormDescription className="mt-2 px-1 text-xs">
                                Select the permissions that apply to this role. Staff assigned to this role will inherit these system powers.
                            </FormDescription>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {role ? "Save Changes" : "Create Role"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
