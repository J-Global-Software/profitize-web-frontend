export default function Industries() {
	const industries = ["Advertising", "Automobile", "Education", "Entertainment", "Finance", "Hospitality", "IT / Technology", "Life Science", "Manufacturing"];

	return (
		<section className="bg-gray-50 py-16" id="industries">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
					<div className="max-w-xl">
						<h2 className="text-4xl md:text-5xl font-black mb-3">Industries Served</h2>
						<p className="text-gray-500 text-sm">Targeted expertise across high-growth global sectors with specialized functional teams.</p>
					</div>
				</div>

				{/* Pills */}
				<div className="flex flex-wrap gap-3 justify-center md:justify-start">
					{industries.map((industry) => (
						<div key={industry} className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
							<span className="text-sm font-semibold text-gray-700">{industry}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
