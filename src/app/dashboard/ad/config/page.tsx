import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  Bell,
  Image,
  CreditCard,
  Building,
  Wrench,
  Shield,
  ArrowRightLeft,
  Clock,
  DollarSign,
  Users,
  FileText,
} from "lucide-react";

interface ConfigItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const configItems: ConfigItem[] = [
  {
    title: "Dispute Resolution",
    description: "Configure dispute handling and resolution processes",
    href: "/dashboard/ad/config/dispute-resolution",
    icon: Shield,
    color: "bg-cyan-500",
  },
  {
    title: "Transaction Flow",
    description: "Set up and manage transaction workflow configurations",
    href: "/dashboard/ad/config/transaction-flow",
    icon: ArrowRightLeft,
    color: "bg-cyan-500",
  },
  {
    title: "System Timers",
    description: "Configure timing settings for various system processes",
    href: "/dashboard/ad/config/system-timers",
    icon: Clock,
    color: "bg-cyan-500",
  },
  {
    title: "Escrow Fees Configuration",
    description: "Manage platform fees and commission rules",
    href: "/dashboard/ad/config/currency-settings",
    icon: DollarSign,
    color: "bg-cyan-500",
  },
  {
    title: "Social Login Credentials",
    description: "Configure OAuth providers and social login integrations",
    href: "/dashboard/ad/config/social-credentials",
    icon: Users,
    color: "bg-cyan-500",
  },
  {
    title: "Payment Settings",
    description: "Configure fees for deposit and withdrawal methods",
    href: "/dashboard/ad/config/payments",
    icon: CreditCard,
    color: "bg-cyan-500",
  },
  {
    title: "Policy Pages",
    description: "Manage legal documents and policy content for your platform",
    href: "/dashboard/ad/config/policy-pages",
    icon: FileText,
    color: "bg-cyan-500",
  },
  {
    title: "General Settings",
    description: "Configure the fundamental information of the site",
    href: "#",
    icon: Settings,
    color: "bg-cyan-500",
  },
  // {
  //   title: "System Configuration",
  //   description: "Control all of the basic modules of the system",
  //   href: "#",
  //   icon: Wrench,
  //   color: "bg-cyan-500",
  // },
  // {
  //   title: "Notification Settings",
  //   description: "configure overall notification elements of the system",
  //   href: "#",
  //   icon: Bell,
  //   color: "bg-cyan-500",
  // },
];

export default function ConfigOverviewPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            System Configurations
          </h1>
          <p className="text-gray-600">
            Manage all system settings and configurations from one place
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configItems.map((item, index) => (
            <Link key={index} href={item.href} className="group block">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200 group-hover:border-cyan-300 py-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`${item.color} p-3 rounded-lg flex-shrink-0`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtle arrow indicator
                  <div className="mt-4 flex justify-end">
                    <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-cyan-100 flex items-center justify-center transition-colors">
                      <svg
                        className="w-3 h-3 text-gray-400 group-hover:text-cyan-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
