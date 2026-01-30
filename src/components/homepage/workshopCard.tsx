type Workshop = {
	key: string;
};

export function WorkshopBlock({ t, workshop }: { t: any; workshop: Workshop }) {
	const base = `resources.workshops.${workshop.key}`;

	return (
		<a
			href={t(`${base}.link`)}
			target="_blank"
			rel="noopener noreferrer"
			className="group flex items-center gap-6 px-4 py-4 rounded-xl border-b border-[#e7ebf3]
				hover:bg-[#f6f6f8] transition-all last:border-0"
		>
			{/* DATE CIRCLE */}
			<div
				className="flex flex-col items-center justify-center w-16 h-16 shrink-0 rounded-full
				bg-white border-2 border-[#1754cf]/20 shadow-sm"
			>
				<span className="text-[10px] font-bold uppercase tracking-tight text-[#1754cf] leading-none">{t(`${base}.month`)}</span>
				<span className="text-xl font-bold text-[#0e121b] leading-none mt-0.5">{t(`${base}.date`)}</span>
			</div>

			{/* CONTENT */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-3 mb-1">
					<h3 className="text-lg font-semibold text-[#0e121b] truncate group-hover:text-[#1754cf] transition-colors">{t(`${base}.title`)}</h3>

					{/* LANGUAGE BADGE */}
				</div>

				<p className="text-sm text-[#4e6797] font-medium">{t(`${base}.detail`)}</p>
			</div>

			{/* CTA */}
			<div className="shrink-0">
				<div
					className="flex items-center justify-center h-9 px-4 rounded-full
					border border-[#1754cf]/30 text-[#1754cf] text-xs font-bold
					group-hover:bg-[#1754cf] group-hover:text-white transition-all"
				>
					{t(`${base}.cta`)}
				</div>
			</div>
		</a>
	);
}
