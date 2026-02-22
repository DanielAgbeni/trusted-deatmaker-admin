"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMarketplaceColumns } from "../_columns/marketplace-table-column";
import { HistoryTable } from "@/components/dashboard/tables";
import { useGetVendorsQuery, useGetEscrowFeesQuery } from "@/lib/store/features/adminDashboardApi/adminDashboardApi";

export default function MarketplacePage() {
  const router = useRouter();
  const { data: vendorsResponse, isLoading: vendorsLoading } = useGetVendorsQuery({ page: 0, size: 20 });
  const { data: feesResponse, isLoading: feesLoading } = useGetEscrowFeesQuery({ page: 0, size: 100 });

  const handleView = useCallback((vendor: any) => {
    router.push(`/dashboard/ad/marketplace/${vendor.id}`);
  }, [router]);

  const columns = useMemo(() => getMarketplaceColumns(handleView), [handleView]);

  const vendors = vendorsResponse?.data?.content || [];
  const fees = feesResponse?.data?.content || (Array.isArray(feesResponse?.data) ? feesResponse?.data : []);

  // Merge fees into vendors
  const vendorsWithFees = useMemo(() => {
    return vendors.map(vendor => {
      // Robust matching: check for vendor object ID or direct vendorId string
      const vendorFee = fees.find((f: any) =>
        (f.vendor?.id === vendor.id) ||
        (f.vendorId === vendor.id) ||
        (f.vendor === vendor.id)
      );

      return {
        ...vendor,
        escrowFee: vendorFee
      };
    });
  }, [vendors, fees]);

  const isLoading = vendorsLoading || feesLoading;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplaces / Vendors</h1>
          <p className="text-muted-foreground">
            Manage registered vendors and their commission status.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <HistoryTable columns={columns} data={vendorsWithFees} isLoading={isLoading} />
      </div>
    </div>
  );
}
