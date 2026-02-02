import { memo } from 'react';

interface DisputeBannerProps {
	amount: number;
	currency?: string;
}

const formatCurrency = (amount: number, currency: string = '₦') => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		currencyDisplay: 'narrowSymbol',
	})
		.format(amount)
		.replace('NGN', currency);
};

export const DisputeBanner = memo(
	({ amount, currency = '₦' }: DisputeBannerProps) => {
		return (
			<div className="bg-[#2EB85C] px-4 py-2 flex items-center justify-center text-white font-medium text-sm">
				Paid amount:{' '}
				<span className="font-bold ml-1">{formatCurrency(amount)}</span>
			</div>
		);
	},
);

DisputeBanner.displayName = 'DisputeBanner';
