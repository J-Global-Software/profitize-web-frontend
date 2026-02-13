import React from "react";
import { HiOutlineArrowLongRight, HiOutlineChartBarSquare } from "react-icons/hi2";

export default function ProfitizeApproachSection() {
	return (
		<section className="py-20 bg-white" id="approach">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* Header Section */}
				<div className="text-center mb-16">
					<span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#1754cf]/60 block mb-2">Strategic Framework</span>
					<h2 className="serif-header text-4xl md:text-5xl font-black text-[#111318]">Profitize Approach</h2>
					<div className="w-12 h-1 bg-[#1754cf]/20 mx-auto mt-4 rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative">
					{/* Column 1: Plan */}
					<div className="flex flex-col gap-6">
						<div className="mb-4">
							<h3 className="serif-header text-3xl font-black text-[#111318]">Plan</h3>
							<p className="text-sm text-gray-500 mt-4 leading-relaxed">Conducting stakeholder audits to identify high-impact profit potential across four key operational pillars.</p>
						</div>
						<div className="space-y-4">
							<PillarCard color="bg-[#3b82f6]" step="01" title="Cost cutting" />
							<PillarCard color="bg-[#e27d60]" step="02" title="Risk reduction" />
							<PillarCard color="bg-[#a34f73]" step="03" title="Process optimization" />
							<PillarCard color="bg-[#3e8e20]" step="04" title="Profitable business development" />
						</div>
					</div>

					{/* Desktop Arrow 1 */}
					<div className="hidden lg:flex absolute left-[31%] top-1/2 -translate-y-1/2 z-10">
						<HiOutlineArrowLongRight className="text-6xl text-[#1754cf]/10 stroke-1" />
					</div>

					{/* Column 2: Track & Support */}
					<div className="flex flex-col gap-6 bg-[#f0f4ff]/50 p-8 rounded-[2.5rem] border border-[#1754cf]/5 shadow-inner">
						<div className="mb-4">
							<h3 className="serif-header text-3xl font-black text-[#111318]">Track & Support</h3>
							<p className="text-[10px] font-bold text-[#1754cf] uppercase tracking-widest mt-1">Month 1 Performance</p>
						</div>

						<div className="space-y-6">
							<TrackBar label="Cost cutting" value="¥30,000,000" percentage={50} color="bg-[#3b82f6]" />
							<TrackBar label="Risk reduction" value="¥20,000,000" percentage={70} color="bg-[#e27d60]" />
							<TrackBar label="Process optimization" value="¥40,000,000" percentage={60} color="bg-[#a34f73]" />
							<TrackBar label="Business Dev" value="¥10,000,000" percentage={80} color="bg-[#3e8e20]" />
						</div>

						<div className="mt-4 pt-4 text-center">
							<div className="inline-block px-6 py-2 bg-[#1754cf] text-white rounded-full shadow-lg shadow-[#1754cf]/20">
								<span className="text-[10px] font-black tracking-widest uppercase">65% Average on Track</span>
							</div>
						</div>
					</div>

					{/* Desktop Arrow 2 */}
					<div className="hidden lg:flex absolute left-[64%] top-1/2 -translate-y-1/2 z-10">
						<HiOutlineArrowLongRight className="text-6xl text-[#1754cf]/10 stroke-1" />
					</div>

					{/* Column 3: Achieve Profit */}
					<div className="flex flex-col gap-6">
						<div className="mb-4">
							<h3 className="serif-header text-3xl font-black text-[#111318]">Achieve Profit</h3>
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Annual Target</p>
						</div>

						<div className="space-y-3">
							<TargetRow color="border-[#3b82f6]" amount="¥100,000,000" />
							<TargetRow color="border-[#e27d60]" amount="¥70,000,000" />
							<TargetRow color="border-[#a34f73]" amount="¥90,000,000" />
							<TargetRow color="border-[#3e8e20]" amount="¥50,000,000" />
						</div>

						<div className="mt-4">
							<div className="bg-[#1754cf] text-white p-8 rounded-[2rem] shadow-2xl shadow-[#1754cf]/30 flex flex-col gap-2 relative overflow-hidden group">
								<div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
									<HiOutlineChartBarSquare className="text-[120px]" />
								</div>
								<p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Total Projected Profit</p>
								<p className="text-4xl font-black">¥310,000,000</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/** * Sub-Components
 */

function PillarCard({ step, title, color }: { step: string; title: string; color: string }) {
	return (
		<div className={`${color} p-5 text-white rounded-2xl shadow-sm transition-transform hover:scale-[1.02] cursor-default`}>
			<span className="text-[9px] font-black uppercase tracking-widest mb-1 block opacity-80">Pillar {step}</span>
			<h4 className="font-bold text-lg leading-tight">{title}</h4>
		</div>
	);
}

function TrackBar({ label, value, percentage, color }: { label: string; value: string; percentage: number; color: string }) {
	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<span className="text-[11px] font-bold uppercase tracking-tight text-[#111318]">{label}</span>
				<span className="text-[11px] font-black text-[#111318]">{value}</span>
			</div>
			<div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
				<div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
			</div>
			<p className="text-[8px] font-bold mt-1 text-right text-gray-400 uppercase tracking-widest">{percentage}% On Track</p>
		</div>
	);
}

function TargetRow({ color, amount }: { color: string; amount: string }) {
	return (
		<div className={`flex justify-between items-center p-4 bg-white rounded-2xl border-l-4 ${color} shadow-sm border border-gray-100/50`}>
			<span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Target</span>
			<span className="text-md font-black text-[#111318]">{amount}</span>
		</div>
	);
}
