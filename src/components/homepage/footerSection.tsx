export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100 pt-24 pb-12">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* ================= TOP ================= */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
					{/* Left */}
					<div>
						<h2 className="text-4xl font-black mb-8">
							Let&apos;s Build Your <br />
							Global Roadmap.
						</h2>

						<div className="space-y-4">
							<p className="text-gray-500 max-w-[400px]">Headquartered in Sydney, serving clients worldwide. Partner with us for high-impact transformation.</p>

							<div className="flex gap-4 pt-4">
								{[
									{ icon: "share", label: "Share" },
									{ icon: "mail", label: "Email" },
									{ icon: "call", label: "Call" },
								].map((item) => (
									<a key={item.icon} href="#" aria-label={item.label} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1754cf] hover:text-white transition-colors">
										<span className="material-symbols-outlined">{item.icon}</span>
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Right – Form */}
					<div className="bg-gray-50 p-10 rounded-3xl">
						<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="flex flex-col gap-2">
								<label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
								<input type="text" placeholder="John Doe" className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]" />
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-xs font-bold uppercase tracking-widest opacity-60">Work Email</label>
								<input type="email" placeholder="john@company.com" className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]" />
							</div>

							<div className="flex flex-col gap-2 md:col-span-2">
								<label className="text-xs font-bold uppercase tracking-widest opacity-60">Inquiry Type</label>
								<select className="bg-white border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#1754cf]">
									<option>Strategic Advisory</option>
									<option>Technical Engineering</option>
									<option>Global Expansion</option>
								</select>
							</div>

							<div className="flex flex-col gap-2 md:col-span-2">
								<label className="text-xs font-bold uppercase tracking-widest opacity-60">Message</label>
								<textarea placeholder="How can we help?" className="bg-white border-none rounded-xl py-3 px-4 h-32 focus:ring-2 focus:ring-[#1754cf]" />
							</div>

							<button type="submit" className="md:col-span-2 bg-[#1754cf] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1754cf]/20 hover:bg-blue-600 transition-all">
								Send Message
							</button>
						</form>
					</div>
				</div>

				{/* ================= BOTTOM ================= */}
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
						{["Privacy", "Terms", "Ethics"].map((item) => (
							<a key={item} href="#" className="hover:text-[#1754cf] transition-colors">
								{item}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
