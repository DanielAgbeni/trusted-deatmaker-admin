'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { HistoryTable } from '@/components/dashboard/tables';
import {
	WalletTransaction,
	WalletTransactionsColumns,
} from '../_columns/wallet-transactions-table-column';

type TransactionHistoryProps = {
	isKYCCompleted: boolean;
	walletBalance: any;
	transactions: WalletTransaction[];
	isLoading: boolean;
	isError: boolean;
	currentPage: number;
	totalPages: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onRefresh: () => void;
};

export default function WalletTransactionHistory({
	isKYCCompleted,
	transactions = [],
	isLoading,
	currentPage,
	totalPages,
	totalItems,
	onPageChange,
	onRefresh,
}: TransactionHistoryProps) {
	const router = useRouter();

	const handleRowClick = (transactionId: string) => {
		router.push(`wallet/transaction/${transactionId}`);
	};

	const handleFilterTransactions = (value: string) => {
		return;
	};

	// Loading skeleton for table
	const TableSkeleton = () => (
		<div className="space-y-4">
			{[1, 2, 3, 4, 5].map((row) => (
				<div
					key={row}
					className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-32"></div>
						<div className="h-3 bg-gray-100 rounded w-24"></div>
					</div>
					<div className="space-y-2">
						<div className="h-4 bg-gray-200 rounded w-24"></div>
						<div className="h-3 bg-gray-100 rounded w-20"></div>
					</div>
					<div className="h-8 bg-gray-200 rounded w-24"></div>
				</div>
			))}
		</div>
	);

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Wallet Transactions History</h2>

				<div className="flex items-center space-x-2">
					<button
						onClick={onRefresh}
						className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2">
						Refresh
					</button>
					<Input
						placeholder="Filter by Transaction ID"
						onChange={(event) => handleFilterTransactions(event.target.value)}
						className="max-w-sm"
					/>
				</div>
			</div>

			{isLoading ? (
				<TableSkeleton />
			) : (
				<>
					<HistoryTable
						data={transactions}
						columns={WalletTransactionsColumns}
					/>
					{totalPages > 1 && (
						<div className="flex justify-between items-center pt-4">
							<div className="text-sm text-gray-500">
								Showing page {currentPage + 1} of {totalPages} ({totalItems}{' '}
								total items)
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => onPageChange(currentPage - 1)}
									disabled={currentPage === 0 || isLoading}
									className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50">
									Previous
								</button>
								<span className="text-sm">Page {currentPage + 1}</span>
								<button
									onClick={() => onPageChange(currentPage + 1)}
									disabled={currentPage >= totalPages - 1 || isLoading}
									className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50">
									Next
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
