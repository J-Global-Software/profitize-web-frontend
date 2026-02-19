import React from "react";
import { HiOutlineChartBarSquare, HiOutlineArrowTrendingUp, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineRocketLaunch, HiOutlineArrowUpRight } from "react-icons/hi2";

/**
 * Types & Interfaces
 */
interface MethodCardProps {
	step: string;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	isFeatured?: boolean;
	accentColor?: "blue" | "indigo" | "emerald" | "orange" | "purple";
}

interface MiniPillarProps {
	icon: React.ReactNode;
	label: string;
	colorClass: string;
}

interface StatBarProps {
	label: string;
	pct: number;
	val: string;
	colorClass: string;
}

interface TargetRowProps {
	label: string;
	amount: string;
}

/**
 * Main Section Component
 */
export default function ProfitizeApproachSection() {
	return (
		<section className="relative py-32 bg-[#fafbff] overflow-hidden" id="approach">
			<div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
				<div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/20 blur-[100px] animate-pulse" />
				<div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-emerald-100/40 to-blue-100/30 blur-[100px]" />
				<div className="absolute top-[20%] right-[10%] w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
			</div>

			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-5xl mb-15 font-black text-slate-900 tracking-tight leading-[0.9] text-center">
					Profitize&nbsp;<span className="text-blue-600">アプローチ</span>
				</h2>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Step 1 */}
					<MethodCard step="01" title="計画" subtitle="戦略フレームワーク" accentColor="blue">
						<div className="grid grid-cols-1 gap-3 mt-6">
							<MiniPillar icon={<HiOutlineBolt />} label="コスト削減" colorClass="text-[#3b82f6]" />
							<MiniPillar icon={<HiOutlineShieldCheck />} label="リスク軽減" colorClass="text-[#e27d60]" />
							<MiniPillar icon={<HiOutlineArrowTrendingUp />} label="業務プロセス最適化" colorClass="text-[#a34f73]" />
							<MiniPillar icon={<HiOutlineRocketLaunch />} label="収益性の高い事業開発" colorClass="text-[#3e8e20]" />
						</div>
					</MethodCard>

					{/* Step 2 */}
					<MethodCard step="02" title="進捗管理・サポート" subtitle="1ヶ月目" accentColor="indigo" isFeatured>
						<div className="mt-8 space-y-6">
							<div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 shadow-sm">
								<span className="text-xs font-bold text-slate-400">進捗状況</span>
								<span className="text-xs font-black text-indigo-600 uppercase">65% 順調</span>
							</div>

							<StatBar label="コスト削減" pct={50} val="¥30,000,000" colorClass="bg-[#3b82f6]" />
							<StatBar label="リスク軽減" pct={70} val="¥20,000,000" colorClass="bg-[#e27d60]" />
							<StatBar label="業務プロセス最適化" pct={60} val="¥40,000,000" colorClass="bg-[#a34f73]" />
							<StatBar label="収益性の高い事業開発" pct={80} val="¥10,000,000" colorClass="bg-[#3e8e20]" />
						</div>
					</MethodCard>

					{/* Step 3 */}
					<MethodCard step="03" title="利益の実現" subtitle="年間目標" accentColor="emerald">
						<div className="mt-6 divide-y divide-slate-100">
							<TargetRow label="コスト削減" amount="¥100,000,000" />
							<TargetRow label="リスク軽減" amount="¥70,000,000" />
							<TargetRow label="業務プロセス最適化" amount="¥90,000,000" />
							<TargetRow label="収益性の高い事業開発" amount="¥50,000,000" />
						</div>

						<div className="mt-auto group relative cursor-pointer pt-6">
							<div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
							<div className="relative bg-slate-950 p-6 rounded-[2rem] text-white flex justify-between items-center overflow-hidden">
								<div className="z-10">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">予測合計</p>
									<p className="text-3xl font-black italic">¥310,000,000</p>
								</div>
								<HiOutlineChartBarSquare className="absolute -right-2 -bottom-2 text-7xl text-white/5 group-hover:scale-110 transition-transform duration-500" />
							</div>
						</div>
					</MethodCard>
				</div>
			</div>
		</section>
	);
}

/**
 * UI Components (UNCHANGED)
 */

function MethodCard({ step, title, subtitle, children, isFeatured = false, accentColor = "blue" }: MethodCardProps) {
	const accentTextColors = {
		blue: "text-blue-600",
		indigo: "text-indigo-600",
		emerald: "text-emerald-600",
		orange: "text-orange-600",
		purple: "text-purple-600",
	};

	return (
		<div
			className={`
        relative flex flex-col h-full p-8 md:p-10 rounded-[3.5rem] transition-all duration-700
        ${isFeatured ? "bg-white/90 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-2 border-indigo-50 z-10 lg:scale-105" : "bg-white/40 border border-white/60 hover:bg-white/60 shadow-xl"}
        backdrop-blur-2xl hover:-translate-y-4
      `}
		>
			<span className="absolute top-6 right-10 text-8xl font-black text-slate-900/[0.03] select-none">{step}</span>

			<div className="mb-8 relative z-10">
				<p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${accentTextColors[accentColor]}`}>{subtitle}</p>
				<h3 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h3>
			</div>

			<div className="relative z-10 flex-grow">{children}</div>
		</div>
	);
}

function MiniPillar({ icon, label, colorClass }: MiniPillarProps) {
	return (
		<div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-50 hover:border-blue-200 transition-all group">
			<div className={`text-xl ${colorClass} group-hover:scale-110 transition-transform`}>{icon}</div>
			<span className="text-sm font-bold text-slate-700">{label}</span>
		</div>
	);
}

function StatBar({ label, pct, val, colorClass }: StatBarProps) {
	return (
		<div className="group">
			<div className="flex justify-between mb-2">
				<span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
				<span className="text-xs font-black text-slate-900">{val}</span>
			</div>
			<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
				<div className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-in-out`} style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
}

function TargetRow({ label, amount }: TargetRowProps) {
	return (
		<div className="flex justify-between items-center py-4 group">
			<span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-900 transition-colors">{label}</span>
			<span className="text-sm font-black text-slate-900">{amount}</span>
		</div>
	);
}
