"use client";
import React from "react";
import Image from "next/image";

export default function GlobalConsulting() {
	return (
		<div className="bg-[#f6f6f8] text-[#111318] min-h-screen">
			<style jsx global>{`
				@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap");
				@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

				.material-symbols-outlined {
					font-variation-settings:
						"FILL" 0,
						"wght" 200,
						"GRAD" 0,
						"opsz" 20;
				}

				body {
					font-family: "Inter", sans-serif;
					scroll-behavior: smooth;
				}

				. {
					font-family: "Playfair Display", serif;
				}
			`}</style>

			{/* Header */}
			<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f0f2f4]">
				<div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-2">
						<Image
							src="/images/logo.png" // put your logo in /public
							alt="Global Consulting"
							width={128}
							height={32}
							className="object-contain"
							priority
						/>
					</div>
					<nav className="hidden lg:flex items-center gap-8">
						<a className="text-sm font-medium hover:text-[#1754cf] transition-colors" href="#who-we-help">
							Who We Help
						</a>
						<a className="text-sm font-medium hover:text-[#1754cf] transition-colors" href="#industries">
							Industries
						</a>
						<a className="text-sm font-medium hover:text-[#1754cf] transition-colors" href="#services">
							Services
						</a>
						<a className="text-sm font-medium hover:text-[#1754cf] transition-colors" href="#pricing">
							Pricing
						</a>
						<a className="text-sm font-medium hover:text-[#1754cf] transition-colors" href="#resources">
							Resources
						</a>
						<div className="flex items-center bg-gray-100 p-1 rounded-full">
							<button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-full">EN</button>
							<button className="px-3 py-1 text-[10px] font-bold text-gray-400 hover:text-gray-600">JP</button>
						</div>
						<button className="bg-[#1754cf] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all">Book Consultation</button>
					</nav>
				</div>
			</header>

			<main>
				{/* Hero Section */}
				<section className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
						<div className="flex flex-col gap-8 order-2 md:order-1">
							<div className="inline-flex items-center gap-3">
								<span className="bg-[#1754cf] text-white px-3 py-1 rounded text-xs font-black">30% OFF</span>
								<span className="text-xs font-bold uppercase tracking-widest text-[#1754cf]">Strategic Launch Offer</span>
							</div>
							<h1 className=" text-6xl md:text-7xl font-black  text-[#111318]">
								Strategy for <br />
								<span className="text-[#1754cf] italic">Global Success.</span>
							</h1>
							<p className="text-xl text-gray-600 max-w-[500px] leading-relaxed">Elevating B2B and B2C enterprises through high-impact advisory across the Pacific and Beyond.</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<button className="bg-[#1754cf] text-white text-base font-bold px-10 py-3 rounded-xl shadow-xl shadow-[#1754cf]/20 hover:scale-[1.02] transition-transform">Book Consultation</button>
								<button className="bg-white border-2 border-[#1754cf]/10 text-[#1754cf] text-base font-bold px-10 py-3 rounded-xl hover:bg-[#f0f4ff] transition-colors">View Offer</button>
							</div>
						</div>
						<div className="relative order-1 md:order-2">
							<div className="w-full aspect-[3/2]  bg-center bg-cover rounded-[2rem] shadow-2xl overflow-hidden" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1000&fit=crop")' }}>
								<div className="absolute inset-0 bg-[#1754cf]/10 mix-blend-multiply"></div>
							</div>
						</div>
					</div>
				</section>

				{/* Who We Help */}
				<section className="bg-white py-24" id="who-we-help">
					<div className="max-w-[1200px] mx-auto px-6">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
							<div className="relative group">
								<div className="absolute -inset-4 bg-[#1754cf]/5 rounded-[2.5rem] -rotate-2 group-hover:rotate-0 transition-transform"></div>
								<div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1000&fit=crop")' }}>
									<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
									<div className="absolute bottom-10 left-10 text-white">
										<span className="text-xs font-bold uppercase tracking-[0.3em]">Network Focus</span>
										<h3 className=" text-3xl font-black mt-2 leading-tight">
											A Global Hub of
											<br />
											Strategic Excellence
										</h3>
									</div>
								</div>
							</div>
							<div>
								<h2 className=" text-4xl md:text-5xl font-black mb-8">Who We Help</h2>
								<p className="text-lg text-gray-500 mb-8 leading-relaxed">
									We partner with ambitious founders and established corporate leaders. Our firm specializes in the delicate balance between
									<span className="text-[#1754cf] font-bold"> B2B relationship management</span> and <span className="text-[#1754cf] font-bold">B2C market penetration</span>.
								</p>
								<div className="space-y-6 mb-12">
									<div className="flex items-start gap-4">
										<div className="mt-1 p-2 bg-[#f0f4ff] rounded-lg text-[#1754cf]">
											<span className="material-symbols-outlined">rocket_launch</span>
										</div>
										<div>
											<h4 className="font-bold text-xl">IT & Tech Focus</h4>
											<p className="text-sm text-gray-500">Accelerating scale-ups and tech giants with specialized market-entry and engineering advisory.</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="mt-1 p-2 bg-[#f0f4ff] rounded-lg text-[#1754cf]">
											<span className="material-symbols-outlined">corporate_fare</span>
										</div>
										<div>
											<h4 className="font-bold text-xl">Diverse B2B/B2C</h4>
											<p className="text-sm text-gray-500">Bridging the gap for consumer brands and industrial suppliers across 4 major global hubs.</p>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
									<div className="bg-gray-50 p-4 py-6 rounded-xl border border-gray-100 text-center">
										<h5 className="text-2xl font-black text-[#1754cf] mb-1">AUS</h5>
										<p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Sydney</p>
									</div>
									<div className="bg-gray-50 p-4 py-6 rounded-xl border border-gray-100 text-center">
										<h5 className="text-2xl font-black text-[#1754cf] mb-1">SG</h5>
										<p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Singapore</p>
									</div>
									<div className="bg-gray-50 p-4 py-6 rounded-xl border border-gray-100 text-center">
										<h5 className="text-2xl font-black text-[#1754cf] mb-1">TW</h5>
										<p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Taipei</p>
									</div>
									<div className="bg-gray-50 p-4 py-6 rounded-xl border border-gray-100 text-center">
										<h5 className="text-2xl font-black text-[#1754cf] mb-1">US</h5>
										<p className="text-[9px] font-bold uppercase tracking-widest opacity-60">New York</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Industries */}
				<section className="bg-gray-50 py-16" id="industries">
					<div className="max-w-[1200px] mx-auto px-6">
						<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
							<div className="max-w-xl">
								<h2 className=" text-4xl font-black mb-3">Industries Served</h2>
								<p className="text-gray-500 text-sm">Targeted expertise across high-growth global sectors with specialized functional teams.</p>
							</div>
							<div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-2">
								<span className="material-symbols-outlined text-xs">tune</span>
								Cross-Border Specialization
							</div>
						</div>
						<div className="flex flex-wrap gap-3 justify-center md:justify-start">
							<div className="group flex items-center gap-3 bg-[#1754cf] text-white px-6 py-3 rounded-full shadow-lg shadow-[#1754cf]/20 cursor-default">
								<span className="material-symbols-outlined !font-light text-lg">devices</span>
								<span className="text-sm font-bold tracking-tight">IT & Technology</span>
								<span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
								<span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Primary Sector</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">account_balance</span>
								<span className="text-sm font-semibold text-gray-700">Finance & Banking</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">hotel</span>
								<span className="text-sm font-semibold text-gray-700">Hospitality</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">shopping_bag</span>
								<span className="text-sm font-semibold text-gray-700">Retail & E-com</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">health_and_safety</span>
								<span className="text-sm font-semibold text-gray-700">Healthcare</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">factory</span>
								<span className="text-sm font-semibold text-gray-700">Manufacturing</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">eco</span>
								<span className="text-sm font-semibold text-gray-700">Renewable Energy</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">biotech</span>
								<span className="text-sm font-semibold text-gray-700">Life Sciences</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">local_shipping</span>
								<span className="text-sm font-semibold text-gray-700">Logistics</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">architecture</span>
								<span className="text-sm font-semibold text-gray-700">Real Estate</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-white border border-gray-100 px-5 py-3 rounded-full hover:border-[#1754cf]/40 hover:bg-[#f0f4ff]/50 transition-all cursor-pointer">
								<span className="material-symbols-outlined text-[#1754cf] text-lg">school</span>
								<span className="text-sm font-semibold text-gray-700">Education Tech</span>
							</div>
							<div className="group flex items-center gap-2.5 bg-[#1754cf]/5 border border-dashed border-[#1754cf]/30 px-5 py-3 rounded-full hover:bg-[#1754cf]/10 transition-all cursor-pointer">
								<span className="text-xs font-bold text-[#1754cf] uppercase tracking-widest">Explore All 15+ Sectors</span>
							</div>
						</div>
					</div>
				</section>

				{/* Services */}
				<section className="py-24" id="services">
					<div className="max-w-[1200px] mx-auto px-6">
						<div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
							<div>
								<h2 className=" text-4xl md:text-5xl font-black mb-4">Our Service Functions</h2>
								<p className="text-gray-500 max-w-[600px]">End-to-end consulting organized by functional expertise for maximum efficiency.</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
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
							].map((service, i) => (
								<div key={i} className="group p-10 bg-white rounded-3xl border-b-4 border-transparent hover:border-[#1754cf] shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
									<div className="absolute top-0 right-0 w-32 h-32 bg-[#1754cf]/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform"></div>
									<div className="relative">
										<div className="w-16 h-16 bg-[#f0f4ff] text-[#1754cf] rounded-2xl flex items-center justify-center mb-8">
											<span className="material-symbols-outlined text-3xl">{service.icon}</span>
										</div>
										<h3 className="text-2xl font-black mb-4">{service.title}</h3>
										<p className="text-sm text-gray-500 leading-relaxed mb-6">{service.desc}</p>

										<a className="text-[#1754cf] font-bold text-sm inline-flex items-center gap-2 group/link" href="#">
											Learn More <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
										</a>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="bg-[#111621] py-28 relative overflow-hidden" id="how-it-works">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1c2a4a]/30 to-transparent"></div>
					<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "60px 60px" }}></div>
					<div className="max-w-[1200px] mx-auto px-6 relative z-10">
						<div className="text-center mb-28">
							<span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-4 block">Methodology &amp; Precision</span>
							<h2 className=" text-4xl md:text-5xl lg:text-6xl font-black text-white">Strategic Transformation Flow</h2>
						</div>
						<div className="relative">
							<div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] pointer-events-none overflow-hidden">
								<svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 2" xmlns="http://www.w3.org/2000/svg">
									<path d="M0 1H1000" stroke="url(#lineGradient)" strokeDasharray="8 8" strokeWidth="2"></path>
									<defs>
										<linearGradient gradientUnits="userSpaceOnUse" id="lineGradient" x1="0" x2="1000" y1="0" y2="0">
											<stop stopColor="#1754cf" stopOpacity="0"></stop>
											<stop offset="0.5" stopColor="#1754cf"></stop>
											<stop offset="1" stopColor="#1754cf" stopOpacity="0"></stop>
										</linearGradient>
									</defs>
								</svg>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
								{[
									{ num: "01", title: "Diagnostic", desc: "Deep-dive 360° audit of organizational workflows and global market positioning." },
									{ num: "02", title: "Architect", desc: "Engineering a data-led roadmap centered on ROI, scalability, and risk mitigation." },
									{ num: "03", title: "Deploy", desc: "Precision implementation across international hubs with localized operational agility." },
									{ num: "04", title: "Sustain", desc: "Continuous performance tracking and recursive strategic tuning for long-term growth." },
								].map((step, i) => (
									<div key={i} className="group flex flex-col items-center text-center">
										<div className="relative mb-10">
											<div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#1754cf] group-hover:border-[#1754cf] transition-all duration-700">
												<span className="text-xl font-black text-white">{step.num}</span>
											</div>
											{i < 3 && (
												<div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
													<span className="material-symbols-outlined text-[#1754cf] text-xl">add</span>
												</div>
											)}
										</div>
										<div className="max-w-[240px]">
											<h4 className=" text-2xl font-bold text-white mb-4">{step.title}</h4>
											<p className="text-sm text-gray-400 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{step.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Pricing */}
				<section className="max-w-[1200px] mx-auto px-6 py-24" id="pricing">
					<div className="text-center mb-16">
						<h2 className=" text-4xl md:text-5xl font-black mb-4">Investment Tiers</h2>
						<div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-2 rounded-full text-sm font-bold">
							<span className="material-symbols-outlined scale-75">verified_user</span> 30% Promo Applied to All Plans
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
						<div className="bg-white p-10 rounded-2xl border border-gray-100 flex flex-col gap-8 shadow-sm">
							<div>
								<h3 className="text-lg font-bold text-gray-400">Essential</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-4xl font-black">$2,790</span>
									<span className="text-sm text-gray-400">/mo</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">WAS $3,990</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Bi-weekly advisory
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Market entry analysis
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Email support
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold border-2 border-[#1754cf] text-[#1754cf] hover:bg-[#1754cf] hover:text-white transition-all">Select Plan</button>
						</div>
						<div className="bg-gray-900 text-white p-12 rounded-[2rem] flex flex-col gap-8 shadow-2xl relative scale-110 z-10">
							<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1754cf] text-white text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full">RECOMMENDED</div>
							<div>
								<h3 className="text-lg font-bold opacity-60">Premium</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-5xl font-black">$5,590</span>
									<span className="text-sm opacity-50">/mo</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">WAS $7,990</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Weekly Executive Calls
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> 2 Global Hub Audits
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Priority Technical Support
								</li>
								<li className="flex items-center gap-3 text-sm opacity-80">
									<span className="material-symbols-outlined text-[#1754cf]">check_circle</span> Dedicated Growth Partner
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold bg-[#1754cf] hover:bg-blue-600 transition-all">Start Accelerating</button>
						</div>
						<div className="bg-white p-10 rounded-2xl border border-gray-100 flex flex-col gap-8 shadow-sm">
							<div>
								<h3 className="text-lg font-bold text-gray-400">Enterprise</h3>
								<div className="flex items-baseline gap-1 mt-4">
									<span className="text-4xl font-black">Custom</span>
								</div>
								<p className="text-xs font-bold text-[#1754cf] mt-2">30% DISCOUNT AVAILABLE</p>
							</div>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Unlimited Global Support
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> On-site Consultation
								</li>
								<li className="flex items-center gap-3 text-sm text-gray-500">
									<span className="material-symbols-outlined text-[#1754cf] text-sm">check</span> Full M&A Advisory
								</li>
							</ul>
							<button className="w-full py-4 rounded-lg font-bold border-2 border-[#1754cf] text-[#1754cf] hover:bg-[#1754cf] hover:text-white transition-all">Talk to Partners</button>
						</div>
					</div>
				</section>

				{/* Client Logos */}
				<section className="py-20 border-t border-gray-100">
					<div className="max-w-[1200px] mx-auto px-6 text-center">
						<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">Empowering Global Market Leaders</p>
						<div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
							<span className="text-3xl font-black italic tracking-tighter">VOLT</span>
							<span className="text-2xl font-black tracking-widest">NEXUS</span>
							<span className="text-3xl font-serif font-black">LUMINA</span>
							<span className="text-2xl font-bold uppercase">ApexGlobal</span>
							<span className="text-2xl font-black">MODERN_</span>
						</div>
					</div>
				</section>

				{/* Resources */}
				<section className="bg-[#f0f4ff]/30 py-24" id="resources">
					<div className="max-w-[1200px] mx-auto px-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
							<div className="bg-white p-10 rounded-2xl shadow-sm">
								<h4 className=" text-2xl font-black mb-6">Resources</h4>
								<div className="space-y-6">
									<a className="flex items-center justify-between group" href="#">
										<div className="flex items-center gap-3">
											<span className="material-symbols-outlined text-[#1754cf]">description</span>
											<span className="text-sm font-bold">2024 Market Report</span>
										</div>
										<span className="material-symbols-outlined text-gray-300 group-hover:text-[#1754cf] transition-colors">download</span>
									</a>
									<a className="flex items-center justify-between group" href="#">
										<div className="flex items-center gap-3">
											<span className="material-symbols-outlined text-[#1754cf]">map</span>
											<span className="text-sm font-bold">APAC Entry Strategy</span>
										</div>
										<span className="material-symbols-outlined text-gray-300 group-hover:text-[#1754cf] transition-colors">download</span>
									</a>
									<a className="flex items-center justify-between group" href="#">
										<div className="flex items-center gap-3">
											<span className="material-symbols-outlined text-[#1754cf]">engineering</span>
											<span className="text-sm font-bold">Tech Stack Audit v2.1</span>
										</div>
										<span className="material-symbols-outlined text-gray-300 group-hover:text-[#1754cf] transition-colors">download</span>
									</a>
								</div>
								<div className="mt-10 pt-10 border-t border-gray-100">
									<h5 className="font-bold text-sm mb-4">Newsletter Signup</h5>
									<form className="flex flex-col gap-2">
										<input className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-3" placeholder="work email address" type="email" />
										<button className="bg-[#1754cf] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest">Subscribe</button>
									</form>
								</div>
							</div>
							<div className="lg:col-span-2">
								<h4 className=" text-3xl font-black mb-8">Upcoming Workshops</h4>
								<div className="space-y-4">
									{[
										{ date: "12", month: "OCT", title: "B2B Scaling in Japan", detail: "Virtual Summit • 4:00 PM GMT" },
										{ date: "24", month: "OCT", title: "Global Engineering Standards", detail: "Hybrid Workshop • Singapore Hub" },
										{ date: "05", month: "NOV", title: "Cross-Border Retail Ethics", detail: "Webinar • 9:00 AM EST" },
									].map((workshop, i) => (
										<div key={i} className="bg-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-lg transition-all border border-transparent hover:border-[#1754cf]/20">
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
											<button className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-bold group-hover:bg-[#1754cf] transition-colors">Reserve Spot</button>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-100 pt-24 pb-12">
				<div className="max-w-[1200px] mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
						<div>
							<h2 className=" text-4xl font-black mb-8">
								Let's Build Your <br />
								Global Roadmap.
							</h2>
							<div className="space-y-4">
								<p className="text-gray-500 max-w-[400px]">Headquartered in Sydney, serving clients worldwide. Partner with us for high-impact transformation.</p>
								<div className="flex gap-4 pt-4">
									<a className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1754cf] hover:text-white transition-colors" href="#">
										<span className="material-symbols-outlined">share</span>
									</a>
									<a className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1754cf] hover:text-white transition-colors" href="#">
										<span className="material-symbols-outlined">mail</span>
									</a>
									<a className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1754cf] hover:text-white transition-colors" href="#">
										<span className="material-symbols-outlined">call</span>
									</a>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 p-10 rounded-3xl">
							<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="flex flex-col gap-2">
									<label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
									<input className="bg-white border-none rounded-xl py-3 focus:ring-2 focus:ring-[#1754cf]" placeholder="John Doe" type="text" />
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-xs font-bold uppercase tracking-widest opacity-60">Work Email</label>
									<input className="bg-white border-none rounded-xl py-3 focus:ring-2 focus:ring-[#1754cf]" placeholder="john@company.com" type="email" />
								</div>
								<div className="flex flex-col gap-2 md:col-span-2">
									<label className="text-xs font-bold uppercase tracking-widest opacity-60">Inquiry Type</label>
									<select className="bg-white border-none rounded-xl py-3 focus:ring-2 focus:ring-[#1754cf]">
										<option>Strategic Advisory</option>
										<option>Technical Engineering</option>
										<option>Global Expansion</option>
									</select>
								</div>
								<div className="flex flex-col gap-2 md:col-span-2">
									<label className="text-xs font-bold uppercase tracking-widest opacity-60">Message</label>
									<textarea className="bg-white border-none rounded-xl py-3 h-32 focus:ring-2 focus:ring-[#1754cf]" placeholder="How can we help?"></textarea>
								</div>
								<button className="md:col-span-2 bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1754cf]/20 hover:bg-blue-600 transition-all">Send Message</button>
							</form>
						</div>
					</div>
					<div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
						<div className="flex items-center gap-2">
							<div className="text-[#1754cf] opacity-50">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
									<path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z" fill="currentColor" />
								</svg>
							</div>
							<p className="text-xs font-medium text-gray-400">© 2024 Global Consulting Group. 30% Promo active for limited time.</p>
						</div>
						<div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
							<a className="hover:text-[#1754cf] transition-colors" href="#">
								Privacy
							</a>
							<a className="hover:text-[#1754cf] transition-colors" href="#">
								Terms
							</a>
							<a className="hover:text-[#1754cf] transition-colors" href="#">
								Ethics
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
