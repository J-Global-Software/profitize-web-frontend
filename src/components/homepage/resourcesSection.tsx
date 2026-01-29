export default function Resources() {
	return (
		<section className="bg-[#f0f4ff]/30 py-24" id="resources">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* ================= RIGHT: WORKSHOPS ================= */}
					<div className="lg:col-span-2">
						<h4 className="text-3xl font-black mb-8">Upcoming Workshops</h4>

						<div className="space-y-4">
							{[
								{
									date: "12",
									month: "OCT",
									title: "B2B Scaling in Japan",
									detail: "Virtual Summit • 4:00 PM GMT",
								},
								{
									date: "24",
									month: "OCT",
									title: "Global Engineering Standards",
									detail: "Hybrid Workshop • Singapore Hub",
								},
								{
									date: "05",
									month: "NOV",
									title: "Cross-Border Retail Ethics",
									detail: "Webinar • 9:00 AM EST",
								},
							].map((workshop) => (
								<div key={workshop.title} className="bg-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-lg transition-all border border-transparent hover:border-[#1754cf]/20">
									<div className="flex items-center gap-6 text-center md:text-left">
										<div className="bg-[#f0f4ff] text-[#1754cf] px-4 py-2 rounded-lg text-center">
											<span className="block text-xl font-black leading-none">{workshop.date}</span>
											<span className="text-[10px] uppercase font-bold">{workshop.month}</span>
										</div>

										<div>
											<h5 className="font-black text-lg">{workshop.title}</h5>
											<p className="text-xs text-gray-400">{workshop.detail}</p>
										</div>
									</div>

									<a
										target="_blank"
										href="https://us02web.zoom.us/j/81458426579?pwd=bczVnwoMNfnA4eo2Rzp7qqaaUsrzXf.1
"
										type="button"
										className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-bold group-hover:bg-[#1754cf] transition-colors"
									>
										Reserve Spot
									</a>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
