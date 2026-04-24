'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, ChevronLeft } from 'lucide-react';

const languages = [
	{ id: 1, sl: 1, name: 'English', code: 'EN', flag: '🇬🇧', status: 'Default' },
	{
		id: 2,
		sl: 1,
		name: 'Banglad',
		code: 'BG',
		flag: '🇧🇩',
		status: 'Selectable',
	},
	{ id: 3, sl: 1, name: 'Turkish', code: 'TK', flag: '🇹🇷', status: 'Enabled' },
	{ id: 4, sl: 1, name: 'English', code: 'EN', flag: '🇬🇧', status: 'Enabled' },
];

export default function LanguageManagerPage() {
	return (
		<div className="container p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col gap-1 mb-6">
				<Link
					href="/dashboard/ad/config"
					className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#0092ca] transition-colors w-fit"
				>
					<ChevronLeft className="w-4 h-4" />
					Back to categories
				</Link>
				<div className="flex items-center justify-between">
					<h1 className="text-[22px] font-semibold text-gray-900">
						Language Manager
					</h1>
					<Button className="bg-[#0092ca] hover:bg-[#007dba] text-white rounded-md px-5 h-10 font-medium">
						Add New
					</Button>
				</div>
			</div>

			<div className="bg-[#f8f9fa] border-l-4 border-black rounded-r-lg p-5 mb-8 text-gray-600 text-sm font-medium leading-relaxed">
				While you are adding a new keyword, it will only add to this current
				language only. Please be careful on entering a keyword, please make sure
				there is no extra space. It needs to be exact and case-sensitive.
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-b border-gray-100 hover:bg-transparent">
									<TableHead className="font-bold text-gray-900 text-xs py-4 pl-4 w-24">
										<div className="flex items-center gap-2">
											<Checkbox className="border-gray-300 rounded-[4px]" />
											<span>SL</span>
											<ChevronsUpDown className="h-3 w-3 text-gray-400" />
										</div>
									</TableHead>
									<TableHead className="font-bold text-gray-900 text-xs py-4">
										Name
									</TableHead>
									<TableHead className="font-bold text-gray-900 text-xs py-4 text-center">
										code
									</TableHead>
									<TableHead className="font-bold text-gray-900 text-xs py-4 text-center">
										Default
									</TableHead>
									<TableHead className="font-bold text-gray-900 text-xs py-4 text-center">
										Action
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{languages.map((item, index) => {
									const isActive =
										item.status === 'Default' || item.status === 'Enabled';
									return (
										<TableRow
											key={index}
											className="border-b border-gray-50 hover:bg-gray-50/50">
											<TableCell className="pl-4 py-5 w-24">
												<div className="flex items-center gap-2">
													<Checkbox className="border-gray-300 rounded-[4px]" />
													<span className="text-[#0ea5e9] font-medium">
														{item.sl}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-5">
												<div className="flex items-center gap-2">
													<span className="text-xl">{item.flag}</span>
													<span className="font-bold text-gray-800 text-[14px]">
														{item.name}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-5 text-center">
												<span className="font-bold text-gray-500 text-[13px]">
													{item.code}
												</span>
											</TableCell>
											<TableCell className="py-5">
												<div className="flex justify-center">
													<span
														className={`inline-flex items-center gap-1.5 px-6 py-1 rounded-sm text-[12px] font-medium ${
															isActive
																? 'bg-[#e8f7ed] text-[#42b76b]'
																: 'bg-[#fef4e8] text-[#f2994a]'
														}`}>
														<span
															className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#42b76b]' : 'bg-[#f2994a]'}`}
														/>
														{item.status}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-5">
												<div className="flex items-center justify-center gap-3">
													<Button
														variant="outline"
														size="sm"
														className="h-8 px-4 rounded-full border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors bg-transparent text-[13px] font-medium">
														Translate
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-8 px-4 rounded-full border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white transition-colors bg-transparent text-[13px] font-medium">
														Edit
													</Button>
													{item.status !== 'Default' && (
														<Button
															variant="outline"
															size="sm"
															className="h-8 px-4 rounded-full border-[#ea5b5b] text-[#ea5b5b] hover:bg-[#ea5b5b] hover:text-white transition-colors bg-transparent text-[13px] font-medium">
															Disable
														</Button>
													)}
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
