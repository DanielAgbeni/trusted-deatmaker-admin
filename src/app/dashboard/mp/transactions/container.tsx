'use client';

import { useState } from 'react';
import TransactionHistory from '@/app/dashboard/ad/transactions/transactions-history';
import StatCards from './commissions-card';
import {
	useGetTransactionsQuery,
	useGetCommissionsQuery,
} from '@/lib/store/features/vendorDashboardApi/vendorDashboardApi';
import { Transaction } from '@/app/dashboard/ad/_columns/transactions-table-column';

export default function WalletContainer() {
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 20;

	const {
		data: transactionsData,
		isLoading: transactionsLoading,
		isFetching: transactionsFetching,
		error: transactionsError,
		refetch: refetchTransactions,
	} = useGetTransactionsQuery({
		page: currentPage,
		size: pageSize,
		sort: 'desc',
	});

	const {
		data: commissionsData,
		isLoading: commissionsLoading,
		isFetching: commissionsFetching,
		error: commissionsError,
	} = useGetCommissionsQuery({
		page: 0,
		size: 1000,
	});

	const isLoading = transactionsLoading || commissionsLoading;
	const isRefreshing = transactionsFetching || commissionsFetching;

	const calculateStats = () => {
		const defaultStats = {
			totalTransactions: 150000,
			pendingTransactions: 265000,
			totalCommission: 80000,
			pendingCommission: 6000,
		};

		if (isLoading) {
			return defaultStats;
		}

		if (transactionsError || commissionsError) {
			return defaultStats;
		}

		const totalTransactions = transactionsData?.data?.totalElements || 0;

		const pendingTransactions =
			transactionsData?.data?.content?.filter(
				(tx: any) => tx.status === 'PENDING',
			).length || 0;

		// Calculate from commissions data
		const totalCommission =
			commissionsData?.data?.content?.reduce(
				(sum: number, commission: any) => sum + (commission.amount || 0),
				0,
			) || 0;

		const pendingCommission =
			commissionsData?.data?.content
				?.filter((c: any) => c.status === 'PENDING')
				.reduce(
					(sum: number, commission: any) => sum + (commission.amount || 0),
					0,
				) || 0;

		return {
			totalTransactions,
			pendingTransactions,
			totalCommission,
			pendingCommission,
		};
	};

	// Transform API transactions to match the Transaction interface
	const transformApiTransactions = (apiTransactions: any[]): Transaction[] => {
		// if (!apiTransactions || apiTransactions.length === 0) {
		//   return TRANSACTIONS_DATA;
		// }

		return apiTransactions.map((apiTx: any, index: number) => {
			const statusMap: Record<string, string> = {
				SUCCESS: 'Completed',
				PENDING: 'Pending',
				FAILED: 'Failed',
				CANCELLED: 'Cancelled',
				PROCESSING: 'Processing',
			};

			return {
				id: apiTx.transactionReference || `tx-${index}`,
				escrowNumber: apiTx.transactionReference || `ESC-${index}`,
				buyerName: apiTx.destinationAccountName || 'N/A',
				buyerUsername: 'N/A',
				sellerName: 'Me',
				sellerUsername: 'vendor',
				amount: `₦${apiTx.amount?.toLocaleString() || '0'}`,
				type: apiTx.type || 'Transaction',
				dateTime:
					new Date(apiTx.date).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					}) +
					`, ${new Date(apiTx.date).toLocaleTimeString('en-US', {
						hour: '2-digit',
						minute: '2-digit',
					})}`,
				marketplace: {
					name: 'Trusted Deal Maker',
					logo: '/logos/tdm.png',
				},
				status: statusMap[apiTx.status] || apiTx.status || 'Pending',
			};
		});
	};

	const stats = calculateStats();
	const apiTransactions = transactionsData?.data?.content || [];
	const transformedTransactions = transformApiTransactions(apiTransactions);
	const totalPages = transactionsData?.data?.totalPages || 0;
	const totalItems = transactionsData?.data?.totalElements || 0;

	return (
		<>
			<StatCards
				stats={[
					{
						title: 'Total Transactions',
						value: stats.totalTransactions,
					},
					{
						title: 'Pending Transactions',
						value: stats.pendingTransactions,
					},
					{
						title: 'Total Commission',
						value: stats.totalCommission,
					},
					{
						title: 'Pending Commissions',
						value: stats.pendingCommission,
					},
				]}
				isLoading={isLoading}
			/>
			<TransactionHistory
				transactions={transformedTransactions}
				isLoading={transactionsLoading}
				isRefreshing={isRefreshing}
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				onPageChange={setCurrentPage}
				onRefresh={refetchTransactions}
			/>
		</>
	);
}
