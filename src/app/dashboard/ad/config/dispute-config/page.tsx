import { Metadata } from "next";
import DisputeConfigForm from "./dispute-config-form";
import { 
  ChevronLeft,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dispute Configuration | Admin Settings",
  description: "Manage global dispute resolution logic, timers, and arbitration settings.",
};

export default function DisputeConfigPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link 
              href="/dashboard/ad/config" 
              className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Configuration
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Settings2 className="w-6 h-6 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dispute Configuration
            </h1>
          </div>
          <p className="text-gray-500 max-w-2xl mt-2 leading-relaxed">
            Fine-tune how disputes behave on your platform. Adjust timing, escalation rules, 
            and arbitration settings to ensure a fair and efficient resolution process.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="hidden md:flex">
            <Link href="/dashboard/ad/disputes">
              View Active Disputes
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="max-w-6xl">
        <DisputeConfigForm />
      </div>
    </div>
  );
}
