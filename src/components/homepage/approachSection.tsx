"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl"; // Added useLocale to toggle text
import { HiOutlineChartBarSquare, HiOutlineArrowTrendingUp, HiOutlineShieldCheck, HiOutlineBolt, HiOutlineRocketLaunch } from "react-icons/hi2";

/**
 * Types and Props interfaces remain the same...
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

export default function ProfitizeApproachSection() {
	const t = useTranslations("homepage.ProfitizeApproachSection");
	const locale = useLocale();

	// Text content - Ideally move these to your messages/en.json and messages/ja.json
	const descriptionEn = "This is an example of helping some departments in a division of a Japanese company to collaborate in cost cutting, risk mitigation and process optimization via our in-house workshops and project facilitation. Many of the biggest pain points and profit increase opportunities are in the gaps between departments, reducing delays, rework and waste.";
	const descriptionJa = "これは、当社が実施する社内ワークショップとプロジェクトファシリテーションを通じて、日本企業の事業部門内における各部署間の連携を促進し、コスト削減・リスク軽減・プロセス最適化を実現した事例です。最大の課題点や利益向上の機会は、多くの場合部署間の連携不足に起因しており、遅延・手戻り・無駄の削減が鍵となります。";

	return (
		<section className="relative py-32 bg-[#fafbff] overflow-hidden" id="approach">
			{/* Background Decoration */}
			<div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
				<div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/20 blur-[100px] animate-pulse" />
				<div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-gradient-to-tr from-emerald-100/40 to-blue-100/30 blur-[100px]" />
				<div className="absolute top-[20%] right-[10%] w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
			</div>

			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<div className="max-w-3xl mx-auto mb-16 text-center">
					<h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
						{t("title.part1")}&nbsp;
						<span className="text-blue-600">{t("title.part2")}</span>
					</h2>

					{/* New Description Section */}
					<p className="text-lg text-slate-600 leading-relaxed font-medium">{locale === "ja" ? descriptionJa : descriptionEn}</p>
				</div>

				{/* 3 Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* STEP 1 */}
					<MethodCard step={t("steps.plan.step")} title={t("steps.plan.title")} subtitle={t("steps.plan.subtitle")} accentColor="blue">
						<div className="grid grid-cols-1 gap-3 mt-6">
							<MiniPillar icon={<HiOutlineBolt />} label={t("steps.plan.pillars.costCutting")} colorClass="text-[#3b82f6]" />
							<MiniPillar icon={<HiOutlineShieldCheck />} label={t("steps.plan.pillars.riskReduction")} colorClass="text-[#e27d60]" />
							<MiniPillar icon={<HiOutlineArrowTrendingUp />} label={t("steps.plan.pillars.processOptimization")} colorClass="text-[#a34f73]" />
							<MiniPillar icon={<HiOutlineRocketLaunch />} label={t("steps.plan.pillars.profitableDevelopment")} colorClass="text-[#3e8e20]" />
						</div>
					</MethodCard>

					{/* STEP 2 */}
					<MethodCard step={t("steps.trackSupport.step")} title={t("steps.trackSupport.title")} subtitle={t("steps.trackSupport.subtitle")} accentColor="indigo" isFeatured>
						<div className="mt-8 space-y-6">
							<div className="flex justify-between items-center bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 shadow-sm">
								<span className="text-xs font-bold text-slate-400">{t("steps.trackSupport.status.label")}</span>
								<span className="text-xs font-black text-indigo-600 uppercase">65% {t("steps.trackSupport.status.value")}</span>
							</div>

							<StatBar label={t("steps.trackSupport.metrics.costCutting")} pct={50} val="¥30,000,000" colorClass="bg-[#3b82f6]" />
							<StatBar label={t("steps.trackSupport.metrics.riskReduction")} pct={70} val="¥20,000,000" colorClass="bg-[#e27d60]" />
							<StatBar label={t("steps.trackSupport.metrics.processOptimization")} pct={60} val="¥40,000,000" colorClass="bg-[#a34f73]" />
							<StatBar label={t("steps.trackSupport.metrics.profitableDevelopment")} pct={80} val="¥10,000,000" colorClass="bg-[#3e8e20]" />
						</div>
					</MethodCard>

					{/* STEP 3 */}
					<MethodCard step={t("steps.achieveProfit.step")} title={t("steps.achieveProfit.title")} subtitle={t("steps.achieveProfit.subtitle")} accentColor="emerald">
						<div className="mt-6 divide-y divide-slate-100">
							<TargetRow label={t("steps.achieveProfit.targets.costCutting")} amount="¥100,000,000" />
							<TargetRow label={t("steps.achieveProfit.targets.riskReduction")} amount="¥70,000,000" />
							<TargetRow label={t("steps.achieveProfit.targets.processOptimization")} amount="¥90,000,000" />
							<TargetRow label={t("steps.achieveProfit.targets.profitableDevelopment")} amount="¥50,000,000" />
						</div>

						<div className="mt-auto group relative cursor-pointer pt-6">
							<div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
							<div className="relative bg-slate-950 p-6 rounded-[2rem] text-white flex justify-between items-center overflow-hidden">
								<div className="z-10">
									<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("steps.achieveProfit.projectedTotalLabel")}</p>
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
 * UI Components (MethodCard, MiniPillar, etc.) remain unchanged below...
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
