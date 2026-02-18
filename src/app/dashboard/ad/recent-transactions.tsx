'use client';

import {
	WalletTransactionsColumns,
	WalletTransaction,
} from './_columns/wallet-transactions-table-column';
import { RecentTableContainer } from '@/components/dashboard/tables';
import {
	useGetDepositsQuery,
	useGetWithdrawalsQuery,
} from '@/lib/store/features/adminDashboardApi/adminDashboardApi';
import { AdminTransaction } from '@/lib/store/features/adminDashboardApi/adminDashboardTypes';

export default function RecentTransactions() {
	const { data: withdrawalsData, isLoading: wLoading } = useGetWithdrawalsQuery(
		{ page: 0, size: 5 },
	);
	const { data: depositsData, isLoading: dLoading } = useGetDepositsQuery({
		page: 0,
		size: 5,
	});

	const withdrawals = withdrawalsData?.data?.content || [];
	const deposits = depositsData?.data?.content || [];

	const mapToWalletTransaction = (
		t: AdminTransaction,
		type: 'withdrawal' | 'deposit',
	): WalletTransaction => ({
		id: t.transactionId,
		user: {
			name: type === 'withdrawal' ? t.payeeName : t.payerName,
			bank: t.destinationBank || 'N/A',
			avatar: '/placeholder.svg?height=40&width=40',
		},
		date: new Date(t.date).toLocaleString(),
		type: type,
		transactionId: t.transactionId,
		amount: t.amount,
		status: t.status as any,
	});

	const allTransactions: WalletTransaction[] = [
		...withdrawals.map((t) => mapToWalletTransaction(t, 'withdrawal')),
		...deposits.map((t) => mapToWalletTransaction(t, 'deposit')),
	]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	return (
		<RecentTableContainer
			title="Recent Customer Wallet Transactions"
			data={allTransactions}
			columns={WalletTransactionsColumns}
			seeAllHref="/dashboard/ad/wallet"
			seeAllText="See All"
			showSeeAll={true}
		/>
	);
}
