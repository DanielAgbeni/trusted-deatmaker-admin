// @ts-nocheck
'use client';

import { useState } from 'react';
import WalletOverview from './wallet-transaction-overview';
import WalletTransactionHistory from './wallet-transaction-history';
import {
	useGetWalletBalanceQuery,
	useGetTransactionsQuery,
} from '@/lib/store/features/vendorDashboardApi/vendorDashboardApi';

export default function WalletContainer() {
	const [isKYCCompleted, setIsKYCCompleted] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	// Fetch wallet balance using RTK Query
	const {
		data: balanceData,
		isLoading: isBalanceLoading,
		isError: isBalanceError,
		refetch: refetchBalance,
	} = useGetWalletBalanceQuery();

	// Fetch transactions using RTK Query
	const {
		data: transactionsData,
		isLoading: isTransactionsLoading,
		isError: isTransactionsError,
		refetch: refetchTransactions,
	} = useGetTransactionsQuery({
		page: currentPage,
		size: pageSize,
		sort: 'desc',
	});

	const handleKYCStatusChange = () => {
		setIsKYCCompleted((status) => !status);
	};

	// Extract balance data from API response
	const walletBalance = balanceData?.data || {
		availableBalance: 0,
		totalBalance: 0,
		currency: 'NGN',
		lastUpdated: new Date().toISOString(),
	};

	// Transform API transactions to match WalletTransaction interface
	const transformApiTransactions = (apiTransactions: any[] = []) => {
		// Return empty array if no transactions
		if (!apiTransactions || apiTransactions.length === 0) {
			return [];
		}

		return apiTransactions.map((apiTx: any, index: number) => ({
			id: apiTx.id || apiTx.reference || `tx-${index}`,
			user: {
				name: apiTx.user?.name || apiTx.buyerName || 'Customer',
				bank: apiTx.bank || 'GTBANK',
				avatar: '/placeholder.svg?height=40&width=40',
			},
			date: apiTx.createdAt
				? new Date(apiTx.createdAt).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					}) +
					`, ${new Date(apiTx.createdAt).toLocaleTimeString('en-US', {
						hour: '2-digit',
						minute: '2-digit',
					})}`
				: '27th March, 2024. 2:39 PM',
			type: apiTx.type || 'Transaction',
			transactionId: apiTx.reference || apiTx.id || `TX-${index}`,
			amount: apiTx.amount || 0,
		}));
	};

	const apiTransactions = transactionsData?.data?.content || [];
	const walletTransactions = transformApiTransactions(apiTransactions);
	const totalPages = transactionsData?.data?.totalPages || 0;
	const totalItems = transactionsData?.data?.totalElements || 0;

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleRefresh = () => {
		refetchBalance();
		refetchTransactions();
	};

	return (
		<>
			<WalletOverview
				isKYCCompleted={isKYCCompleted}
				handleKYCStatusChange={handleKYCStatusChange}
				walletBalance={walletBalance}
				isLoading={isBalanceLoading}
				isError={isBalanceError}
				onRefresh={refetchBalance}
			/>
			<WalletTransactionHistory
				isKYCCompleted={isKYCCompleted}
				walletBalance={walletBalance}
				transactions={walletTransactions}
				isLoading={isTransactionsLoading}
				isError={isTransactionsError}
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				onPageChange={handlePageChange}
				onRefresh={handleRefresh}
			/>
		</>
	);
}
