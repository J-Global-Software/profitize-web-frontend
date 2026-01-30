type Workshop = {
	key: string;
};

export function WorkshopBlock({ t, workshop }: { t: any; workshop: Workshop }) {
	const base = `resources.workshops.${workshop.key}`;

	return (
		<a href={t(`${base}.link`)} target="_blank" rel="noopener noreferrer" className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.15)] transition-all">
			<div className="flex gap-8 items-start">
				{/* DATE BLOCK */}
				<div className="flex-shrink-0 text-center min-w-[56px]">
					<div className="text-xs uppercase tracking-widest text-[#1754cf]">{t(`${base}.month`)}</div>
					<div className="text-3xl font-black leading-none text-gray-900 mt-1">{t(`${base}.date`)}</div>
				</div>

				{/* CONTENT */}
				<div>
					<h4 className="text-lg font-semibold leading-snug text-gray-900 mb-2">{t(`${base}.title`)}</h4>
					<p className="text-sm text-gray-600 max-w-md">{t(`${base}.detail`)}</p>

					<div className="mt-6 text-sm font-semibold text-[#1754cf]">{t(`${base}.cta`)} →</div>
				</div>
			</div>
		</a>
	);
}
