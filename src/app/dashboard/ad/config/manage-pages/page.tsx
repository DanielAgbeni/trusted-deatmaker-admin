'use client';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown } from 'lucide-react';

export default function ManagePages() {
	const pages = [
		{ id: 1, sl: 1, name: 'HOME', slug: '/', hasRemove: false },
		{ id: 2, sl: 1, name: 'HOME', slug: '/', hasRemove: false },
		{ id: 3, sl: 1, name: 'HOME', slug: '/', hasRemove: false },
		{ id: 4, sl: 1, name: 'HOME', slug: '/', hasRemove: true },
	];

	return (
		<div className="container p-4 md:p-6 space-y-6">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-[22px] font-semibold text-gray-900">
					Manage Pages
				</h1>
				<Button className="bg-[#0092ca] hover:bg-[#007da8] text-white px-6 rounded-lg font-medium shadow-none">
					Add New
				</Button>
			</div>

			<div className="border-t border-gray-200 w-full mb-6 mt-[-10px]"></div>

			{/* Table Section */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="border-b border-gray-100 hover:bg-transparent">
							<TableHead className="w-[50px] pl-6 py-5">
								<Checkbox className="border-gray-300" />
							</TableHead>
							<TableHead className="py-5">
								<div className="flex items-center text-[13px] font-bold text-gray-800">
									SL
									<ChevronsUpDown className="ml-1 h-3 w-3 text-gray-300" />
								</div>
							</TableHead>
							<TableHead className="py-5 text-[13px] font-bold text-gray-800">
								Name
							</TableHead>
							<TableHead className="py-5 text-[13px] font-bold text-gray-800">
								Slug
							</TableHead>
							<TableHead className="py-5 text-[13px] font-bold text-gray-800 text-right pr-6">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pages.map((page) => (
							<TableRow
								key={page.id}
								className="border-b border-gray-100 hover:bg-gray-50/50">
								<TableCell className="pl-6 py-5">
									<Checkbox className="border-gray-300" />
								</TableCell>
								<TableCell className="py-5 text-[#0092ca] text-sm">
									{page.sl}
								</TableCell>
								<TableCell className="py-5 text-[13px] font-bold text-gray-800 uppercase tracking-wide">
									{page.name}
								</TableCell>
								<TableCell className="py-5 text-[15px] font-bold text-gray-800">
									{page.slug}
								</TableCell>
								<TableCell className="py-5 text-right pr-6">
									<div className="flex justify-end gap-2">
										<Link href="/dashboard/ad/config/manage-pages/seo">
											<Button
												variant="outline"
												size="sm"
												className="border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca] hover:text-white rounded-full h-8 px-4 text-xs font-semibold shadow-none">
												SEO Settings
											</Button>
										</Link>
										<Button
											variant="outline"
											size="sm"
											className="border-[#0092ca] text-[#0092ca] hover:bg-[#0092ca] hover:text-white rounded-full h-8 px-5 text-xs font-semibold shadow-none">
											Edit
										</Button>
										{page.hasRemove && (
											<Button
												variant="outline"
												size="sm"
												className="border-[#ff4d4f] text-[#ff4d4f] hover:bg-[#ff4d4f] hover:text-white rounded-full h-8 px-4 text-xs font-semibold shadow-none">
												Remove
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
