"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiArrowRight, FiZap, FiLayers, FiClipboard, FiPackage } from "react-icons/fi";

export interface WorkshopSlot {
	id: string;
	date: string;
	time: string;
	lang: string;
	full: string;
}

const features = [
	{ icon: <FiZap size={15} />, label: "The Goal", body: "Slash costs and skyrocket revenue without working more hours." },
	{ icon: <FiLayers size={15} />, label: "The Method", body: "Interactive discussions, process mapping, and real-time business audits." },
	{ icon: <FiClipboard size={15} />, label: "The Agenda", body: "Value Estimation, the Cost/Revenue/Risk Trio, and Process Optimization." },
	{ icon: <FiPackage size={15} />, label: "Deliverables", body: "Leave with a Transformation Goal and a concrete implementation roadmap." },
];

export default function ProfitizeWorkshop({ workshopSlots }: { workshopSlots: WorkshopSlot[] }) {
	// Modal & UI State
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedSlotId, setSelectedSlotId] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// Form Data State
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});

	const openModal = (id: string) => {
		setSelectedSlotId(id);
		setIsModalOpen(true);
		setIsSuccess(false);
		setErrorMessage("");
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrorMessage("");

		try {
			// 1. Send the POST request to your new API route
			const response = await fetch("/api/workshops/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					workshopId: selectedSlotId,
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					phone: formData.phone,
				}),
			});

			const data = await response.json();

			// 2. Handle errors (including the 409 Duplicate Registration)
			if (!response.ok) {
				throw new Error(data.error || "Failed to register. Please try again.");
			}

			// 3. Trigger Success UI
			setIsSuccess(true);

			// 4. RESET THE FORM FIELDS HERE
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
			});
			setSelectedSlotId(""); // Clears the dropdown

			// Auto-close modal after success
			setTimeout(() => {
				setIsModalOpen(false);
				setTimeout(() => setIsSuccess(false), 300); // Reset after closing animation
			}, 2500);
		} catch (error: any) {
			setErrorMessage(error.message || "Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<section className="bg-slate-50 py-20 md:py-28 overflow-hidden" id="workshop">
				<div className="max-w-5xl mx-auto px-6">
					{/* Header */}
					<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
						<div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
							<span className="text-blue-600 font-bold text-sm tracking-wider uppercase mb-4 block">Exclusive 90-Minute Session</span>
							<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
								Unlock Hidden Value: <br className="hidden md:block" />
								The "Profitize" Workshop
							</h2>
							<p className="text-slate-600 md:text-lg">Stop trading your time for survival. Join instructor Jon for a high-impact session to slash costs, skyrocket revenue, and scale your growth.</p>
						</div>
					</motion.div>

					{/* Content Grid */}
					<div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-10 items-start">
						{/* LEFT — Features */}
						<div className="flex flex-col gap-8">
							{features.map((f, i) => (
								<motion.div key={f.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.45 }} className="group flex items-start gap-5">
									<div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 text-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-md transition-all duration-300">
										<div className="group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
									</div>
									<div className="pt-0.5">
										<h4 className="text-slate-900 text-base font-bold mb-1 group-hover:text-blue-600 transition-colors duration-200">{f.label}</h4>
										<p className="text-slate-500 text-sm leading-relaxed">{f.body}</p>
									</div>
								</motion.div>
							))}
						</div>

						{/* RIGHT — Booking Card */}
						<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.55 }} className="sticky top-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
							<div className="flex flex-col gap-3 p-3">
								<h3 className="text-sm font-semibold text-slate-500 px-1">Available Dates</h3>
								<div className="flex flex-col gap-2">
									{workshopSlots.length === 0 ? (
										<div className="p-4 text-center text-sm text-slate-400">No upcoming workshops available right now.</div>
									) : (
										workshopSlots.map((slot, i) => (
											<motion.button key={slot.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06 }} onClick={() => openModal(slot.id)} className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-left">
												<div className="flex flex-col gap-1.5">
													<span className={`w-fit shrink-0 text-[10px] font-black px-2 py-0.5 rounded-md tracking-widest ${slot.lang === "JP" ? "bg-slate-200 text-slate-600" : "bg-blue-100 text-blue-700"}`}>{slot.full}</span>
													<p className="text-sm font-bold text-slate-800 transition-colors leading-tight group-hover:text-blue-700">
														{slot.date} · {slot.time}
													</p>
												</div>
												<div className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600">
													Book <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
												</div>
											</motion.button>
										))
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Modal */}
			<AnimatePresence>
				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && !isSuccess && setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
						<motion.div initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10 border border-slate-100">
							{isSuccess ? (
								<div className="p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
									<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
										<FiCheckCircle className="w-16 h-16 text-blue-600 mb-5" />
									</motion.div>
									<h3 className="text-2xl font-bold text-slate-900 mb-2">Seat Reserved!</h3>
									<p className="text-slate-500 text-sm">We've saved your spot. Check your email shortly for the Zoom link.</p>
								</div>
							) : (
								<div className="p-6 md:p-8">
									<button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
										<FiX className="w-5 h-5" />
									</button>
									<h3 className="text-xl font-bold text-slate-900 mb-1">Claim Your Spot</h3>
									<p className="text-slate-500 text-sm mb-6">Fill out the details below to secure your entry.</p>

									{errorMessage && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{errorMessage}</div>}

									<form onSubmit={handleSubmit} className="space-y-3">
										<div className="grid grid-cols-2 gap-3">
											<input required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white outline-none transition-all text-sm" />
											<input required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white outline-none transition-all text-sm" />
										</div>
										<input required name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white outline-none transition-all text-sm" />

										<select required value={selectedSlotId} onChange={(e) => setSelectedSlotId(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white outline-none transition-all text-sm text-slate-700">
											<option value="" disabled>
												Select a session…
											</option>
											{workshopSlots.map((s) => (
												<option key={s.id} value={s.id}>
													{s.date} · {s.time} ({s.full})
												</option>
											))}
										</select>

										<button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all mt-2 shadow-md shadow-blue-600/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100">
											{isSubmitting ? "Securing your spot..." : "Confirm Reservation"} {!isSubmitting && <FiArrowRight size={13} />}
										</button>
									</form>
								</div>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
