"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  DisputeConfig, 
  disputeConfigSchema, 
  defaultDisputeConfig 
} from "@/types/dispute-config";
import { 
  Save, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Gavel, 
  Bell, 
  Lock,
  ChevronRight,
  Info
} from "lucide-react";
import { toast } from "sonner";
import FlowDiagram from "./flow-diagram";

export default function DisputeConfigForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<DisputeConfig>({
    resolver: zodResolver(disputeConfigSchema),
    defaultValues: defaultDisputeConfig,
  });

  const { isDirty } = form.formState;

  const onSubmit = async (data: DisputeConfig) => {
    setIsSaving(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowConfirmDialog(false);
    form.reset(data); // Clear dirty state
    toast.success("Dispute configurations updated successfully!");
  };

  const handleReset = () => {
    form.reset(defaultDisputeConfig);
    toast.info("Form reset to default values");
  };

  return (
    <div className="relative pb-24">
      {/* Visual Flow Diagram */}
      <div className="mb-8">
        <FlowDiagram />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECTION 1: Tier 1 – User Negotiation Settings */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="bg-blue-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tier 1</span>
              </div>
              <CardTitle className="text-xl">User Negotiation Settings</CardTitle>
              <CardDescription>
                Control how users interact and attempt to resolve disputes independently before admin involvement.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tier1.conversationDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conversation Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Time allowed for users to negotiate after a dispute starts.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tier1.postConversationIdleTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post-Conversation Idle Time (Hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Buffer time for users to take action after negotiation ends.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="tier1.allowTimeExtension"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Time Extension</FormLabel>
                      <FormDescription>
                        If enabled, users can request additional time for negotiation.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("tier1.allowTimeExtension") && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <FormField
                    control={form.control}
                    name="tier1.maximumTimeExtension"
                    render={({ field }) => (
                      <FormItem className="pl-4 border-l-2 border-blue-200">
                        <FormLabel>Maximum Time Extension (Hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          The limit for total extra time that can be granted.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 2: Tier 2 – Admin Intervention Settings */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="bg-purple-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tier 2</span>
              </div>
              <CardTitle className="text-xl">Admin Intervention Settings</CardTitle>
              <CardDescription>
                Configure how admins intervene and set the rules for resolution enforcement.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="tier2.adminResponseTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Response Time (Hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Time users have to respond after an admin submits a resolution.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="tier2.allowUserNegotiation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Negotiation During Tier 2</FormLabel>
                        <FormDescription>
                          Users can still chat and resolve independently.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tier2.autoEnforceAdminDecision"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Auto-Enforce Admin Decision</FormLabel>
                        <FormDescription>
                          Decisions become final after timer expires.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("tier2.autoEnforceAdminDecision") && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start animate-in zoom-in-95 duration-300">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> If enabled, admin decisions will automatically resolve disputes after the timeout period. This cannot be undone once enforced.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 3: Arbitration Settings */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="bg-amber-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Gavel className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Tier 3</span>
              </div>
              <CardTitle className="text-xl">Arbitration Settings</CardTitle>
              <CardDescription>
                Define the final stage for disputes that cannot be resolved through negotiation or admin intervention.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="arbitration.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-amber-50/30">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Arbitration</FormLabel>
                      <FormDescription>
                        Toggle the entire arbitration stage on or off.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("arbitration.enabled") && (
                <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Internal Arbitration */}
                    <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-500" />
                        Internal Arbitration
                      </h4>
                      <FormField
                        control={form.control}
                        name="arbitration.internal.enabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm font-normal text-gray-500">Enable Internal Stage</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="arbitration.internal.cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Internal Arbitration Cost (₦)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                disabled={!form.watch("arbitration.internal.enabled")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* External Arbitration */}
                    <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm space-y-4">
                      <h4 className="font-semibold flex items-center gap-2 text-indigo-600">
                        <CheckCircle2 className="w-4 h-4" />
                        External Arbitration
                      </h4>
                      <FormField
                        control={form.control}
                        name="arbitration.external.enabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm font-normal text-gray-500">Enable External Stage</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="arbitration.external.requireUserSelectProvider"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel className="text-sm font-normal text-gray-500">Require User to Select Provider</FormLabel>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                disabled={!form.watch("arbitration.external.enabled")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>If both internal and external are enabled, users will be allowed to choose between them. Arbitration decisions are final and legally binding.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 4 & 5: Global Controls & Notifications (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Global Timer Controls */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200 h-full">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
                </div>
                <CardTitle className="text-xl">Global Timer Controls</CardTitle>
                <CardDescription>System-wide timing settings for arbitration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <FormField
                  control={form.control}
                  name="globalTimers.defaultTimeUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Time Unit</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="minutes">Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="globalTimers.gracePeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace Period (Minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Buffer before auto-actions trigger.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="globalTimers.notificationReminderTiming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Reminder (Min before)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Notifications Settings */}
            <Card className="border-none shadow-sm ring-1 ring-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Bell className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Alerts</span>
                </div>
                <CardTitle className="text-xl">Notification Settings</CardTitle>
                <CardDescription>Control how users are informed during disputes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {[
                  { name: "onDisputeStart", label: "Notify on dispute start" },
                  { name: "beforeTimerExpires", label: "Notify before timer expires" },
                  { name: "onEscalationAvailable", label: "Notify when escalation is available" },
                  { name: "onAdminResponse", label: "Notify when admin responds" },
                  { name: "onArbitrationAvailable", label: "Notify when arbitration is available" },
                ].map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={`notifications.${item.name}` as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg border border-gray-50 bg-gray-50/30">
                        <FormLabel className="text-sm font-normal cursor-pointer">{item.label}</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* SECTION 6: Safety & Control Settings */}
          <Card className="border-none shadow-sm ring-1 ring-gray-200">
            <CardHeader className="bg-red-50/50 rounded-t-xl">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <Lock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Safety</span>
              </div>
              <CardTitle className="text-xl">Safety & Control Settings</CardTitle>
              <CardDescription>Prevent system misuse or abuse with global safety overrides.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="safety.maxDisputeDuration"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Max Dispute Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Global limit for any dispute.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="safety.forceAutoCloseAfterArbitration"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 rounded-lg border border-red-100 bg-red-50/30">
                        <div className="space-y-0.5">
                          <FormLabel>Force Auto-Close After Arbitration</FormLabel>
                          <FormDescription>Recommended ON for consistency.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="safety.allowAdminOverride"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 rounded-lg border border-red-100 bg-red-50/30">
                        <div className="space-y-0.5">
                          <FormLabel>Allow Admin Override</FormLabel>
                          <FormDescription>Admins can manually move disputes across tiers.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      {/* Sticky Save Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDirty ? (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>You have unsaved changes</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>All changes saved</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isSaving || !isDirty}
              className="hidden md:flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Defaults
            </Button>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button 
                  disabled={!isDirty || isSaving}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[140px] shadow-lg shadow-cyan-200"
                >
                  {isSaving ? (
                    <RotateCcw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply New Configuration?</DialogTitle>
                  <DialogDescription>
                    These changes will affect all active and future disputes. Are you sure you want to proceed?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex gap-4">
                  <div className="bg-amber-100 p-2 rounded-full h-fit mt-1">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Impact assessment:</p>
                    <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                      <li>New timer settings will apply to future stages.</li>
                      <li>Notification rules will update immediately.</li>
                      <li>Arbitration logic changes may affect ongoing disputes.</li>
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                  <Button 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white" 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSaving}
                  >
                    Yes, Apply Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
