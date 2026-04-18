'use client';

import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';

const kycFields = [
	{ id: 1, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
	{ id: 2, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
	{ id: 3, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
	{ id: 4, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
	{ id: 5, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
	{ id: 6, name: 'Full Name', type: 'Text', width: '100%', isRequired: true },
];

export default function KycSettingsPage() {
	return (
		<div className="container p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-[22px] font-semibold text-gray-900">
					KYC Settings
				</h1>
				<Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-lg px-6 h-10 font-medium">
					Add New
				</Button>
			</div>

			<div className="space-y-4">
				{kycFields.map((field) => (
					<div
						key={field.id}
						className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
						<div className="flex items-center text-gray-400 shrink-0 cursor-grab px-2">
							<GripVertical className="h-5 w-5" />
						</div>

						<div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
							<div>
								<h3 className="font-semibold text-gray-900 text-[15px] mb-1.5">
									Name
								</h3>
								<p className="text-gray-500 text-[14px]">{field.name}</p>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 text-[15px] mb-1.5">
									Type
								</h3>
								<p className="text-gray-500 text-[14px]">{field.type}</p>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 text-[15px] mb-1.5">
									Width
								</h3>
								<p className="text-gray-500 text-[14px]">{field.width}</p>
							</div>
						</div>

						<div className="w-auto md:w-40 flex items-center justify-start md:justify-center shrink-0">
							{field.isRequired && (
								<span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm bg-[#e8f7ed] text-[#42b76b] text-[12px] font-medium">
									<span className="w-1.5 h-1.5 rounded-full bg-[#42b76b]" />*
									Required
								</span>
							)}
						</div>

						<div className="flex items-center gap-3 shrink-0">
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-5 rounded-full border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white transition-colors bg-transparent text-[13px] font-medium">
								Edit
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-5 rounded-full border-[#ea5b5b] text-[#ea5b5b] hover:bg-[#ea5b5b] hover:text-white transition-colors bg-transparent text-[13px] font-medium">
								Delete
							</Button>
						</div>
					</div>
				))}
			</div>

			<div className="mt-4">
				<Button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white h-[52px] text-[16px] font-semibold rounded-md transition-colors">
					Submit
				</Button>
			</div>
		</div>
	);
}
