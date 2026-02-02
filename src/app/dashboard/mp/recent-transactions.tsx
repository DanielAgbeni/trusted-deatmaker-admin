// @ts-nocheck
import { RecentTableContainer } from "@/components/dashboard/tables";
import { Transaction, TransactionsColumns } from "./_columns/transactions-table-column";

interface RecentTransactionsProps {
  transactionsData: Transaction[];
  isLoading?: boolean;
  totalTransactions?: number;
}

export default function RecentTransactions({ 
  transactionsData = [], 
  isLoading = false,
  totalTransactions = 0
}: RecentTransactionsProps) {
  
  return (
    <RecentTableContainer
      title="Recent Transactions"
      data={transactionsData}
      columns={TransactionsColumns}
      seeAllHref="/dashboard/mp/transactions"
      seeAllText="See All"
      showSeeAll={true}
      isLoading={isLoading}
      totalCount={totalTransactions}
    />
  );
}