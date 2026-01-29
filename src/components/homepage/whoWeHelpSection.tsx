import Image from "next/image";

export default function WhoWeHelp() {
	return (
		<section className="bg-white py-24" id="who-we-help">
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					{/* Image / Visual */}
					<div className="relative group">
						<div className="absolute -inset-4 bg-[#1754cf]/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform" />

						<div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl">
							<Image src="/images/who-we-help.jpg" alt="Global strategic workspace" fill className="object-cover" priority />

							{/* Gradient overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

							{/* Text overlay */}
							<div className="absolute bottom-10 left-10 text-white">
								<span className="text-xs font-bold uppercase tracking-[0.3em]">Global Perspective</span>
								<h3 className="text-3xl font-black mt-2 leading-tight">
									From Potential
									<br />
									to Profit
								</h3>
							</div>
						</div>
					</div>

					{/* Content */}
					<div>
						<h2 className="text-4xl md:text-5xl font-black mb-8">Who We Help</h2>

						<p className="text-lg text-gray-500 mb-8 leading-relaxed">
							Profitize provides the roadmap to
							<span className="text-[#1754cf] font-bold"> sustainable growth</span> for individuals, departments, and global companies alike. We bridge the gap between
							<span className="text-[#1754cf] font-bold"> potential and profit</span> through bespoke bilingual workshops and strategic solutions tailored to your goals.
						</p>

						<p className="text-gray-500 mb-12 leading-relaxed">
							Backed by <span className="font-bold text-gray-800">J-Global’s international expertise</span>, we support organizations operating across diverse sectors and regions.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">person</span>
								<div>
									<p className="font-medium text-sm">Individuals & Leaders</p>
									<p className="text-xs text-gray-500 leading-snug">Personal and executive growth.</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">groups</span>
								<div>
									<p className="font-medium text-sm">Teams & Departments</p>
									<p className="text-xs text-gray-500 leading-snug">Internal alignment and execution.</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<span className="material-symbols-outlined text-[#1754cf] mt-0.5">public</span>
								<div>
									<p className="font-medium text-sm">Global Companies</p>
									<p className="text-xs text-gray-500 leading-snug">International growth support.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
