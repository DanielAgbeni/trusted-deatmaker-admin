"use client";

import { Shield, MessageSquare, UserCheck, Gavel, ArrowRight } from "lucide-react";

export default function DisputeFlowDiagram() {
  const steps = [
    {
      title: "Tier 1",
      subtitle: "User Negotiation",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "Users attempt to resolve the dispute directly.",
    },
    {
      title: "Tier 2",
      subtitle: "Admin Intervention",
      icon: UserCheck,
      icon2: Shield,
      color: "bg-purple-500",
      description: "Admin reviews the dispute and suggests a resolution.",
    },
    {
      title: "Tier 3",
      subtitle: "Arbitration",
      icon: Gavel,
      color: "bg-amber-500",
      description: "Final legally binding decision by internal or external arbitrator.",
    },
  ];

  return (
    <div className="w-full py-8 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-center w-full">
            <div className="flex flex-col items-center text-center space-y-3 relative z-10 w-full group">
              <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900">{step.title}</h4>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{step.subtitle}</p>
                <p className="text-[10px] text-gray-400 max-w-[120px] mx-auto hidden md:block leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:flex flex-1 items-center justify-center -mx-4">
                <div className="h-[2px] flex-1 bg-gray-200 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-1">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            )}
            
            {index < steps.length - 1 && (
              <div className="md:hidden flex items-center justify-center py-4">
                <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
