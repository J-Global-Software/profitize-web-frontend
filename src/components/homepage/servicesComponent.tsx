type Service = {
	icon: string;
	title: string;
	desc: string;
	image: string;
	label: string;
};

type Step = {
	num: string;
	title: string;
	desc: string;
};

const services: Service[] = [
	{
		icon: "payments",
		title: "Sales & Growth",
		desc: "Revenue optimization, global sales network development, and lead generation frameworks.",
		image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop",
		label: "Scale Strategy",
	},
	{
		icon: "engineering",
		title: "Engineering",
		desc: "Software architecture, system scaling, and technical recruitment for global tech teams.",
		image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
		label: "Technical Depth",
	},
	{
		icon: "biotech",
		title: "R&D Advisory",
		desc: "Innovation auditing, patent strategy, and research-led product development cycles.",
		image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop",
		label: "Pure Innovation",
	},
];

const steps: Step[] = [
	{
		num: "01",
		title: "Diagnostic",
		desc: "Deep-dive 360° audit of organizational workflows and global market positioning.",
	},
	{
		num: "02",
		title: "Architect",
		desc: "Engineering a data-led roadmap centered on ROI, scalability, and risk mitigation.",
	},
	{
		num: "03",
		title: "Deploy",
		desc: "Precision implementation across international hubs with localized operational agility.",
	},
	{
		num: "04",
		title: "Sustain",
		desc: "Continuous performance tracking and recursive strategic tuning for long-term growth.",
	},
];

export default function Services() {
	return (
		<>
			{/* ===================== SERVICES ===================== */}
			<section className="py-24" id="services">
				<div className="max-w-[1200px] mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
						<div>
							<h2 className="text-4xl md:text-5xl font-black mb-4">Our Service Functions</h2>
							<p className="text-gray-500 max-w-[600px]">End-to-end consulting organized by functional expertise for maximum efficiency.</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{services.map((service, i) => (
							<div key={i} className="group p-10 bg-white rounded-3xl border-b-4 border-transparent hover:border-[#1754cf] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-[#1754cf]/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />

								<div className="relative">
									<div className="w-16 h-16 bg-[#f0f4ff] text-[#1754cf] rounded-2xl flex items-center justify-center mb-8">
										<span className="material-symbols-outlined text-3xl">{service.icon}</span>
									</div>

									<h3 className="text-2xl font-black mb-4">{service.title}</h3>

									<p className="text-sm text-gray-500 leading-relaxed mb-6">{service.desc}</p>

									<a href="#" className="text-[#1754cf] font-bold text-sm inline-flex items-center gap-2 group/link">
										Learn More
										<span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
