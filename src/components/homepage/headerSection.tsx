"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const locales = ["en", "ja"] as const;

export default function Header() {
	const locale = useLocale();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	function getLocalizedPath(targetLocale: string) {
		const segments = pathname.split("/").filter(Boolean);

		if (locales.includes(segments[0] as any)) {
			segments[0] = targetLocale;
		} else {
			segments.unshift(targetLocale);
		}

		return "/" + segments.join("/");
	}

	const NavLinks = ({ onClick }: { onClick?: () => void }) => (
		<>
			<Link href="#who-we-help" onClick={onClick} className="text-gray-900 hover:text-[#1754cf]">
				Who We Help
			</Link>
			<Link href="#industries" onClick={onClick} className="text-gray-900 hover:text-[#1754cf]">
				Industries
			</Link>
			<Link href="#services" onClick={onClick} className="text-gray-900 hover:text-[#1754cf]">
				Services
			</Link>
			<Link href="#resources" onClick={onClick} className="text-gray-900 hover:text-[#1754cf]">
				Resources
			</Link>
		</>
	);

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-[#f0f2f4]">
			{/* Header bar */}
			<div className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between px-6">
				{/* Logo (untouched) */}
				<Link href={`/${locale}`} aria-label="Home" className="flex items-center">
					<Image src="/images/logo.png" alt="Global Consulting" width={128} height={32} className="object-contain" priority />
				</Link>

				{/* Right side elements */}
				<div className="flex items-center gap-3">
					{/* Desktop nav */}
					<nav className="hidden lg:flex items-center gap-8">
						<NavLinks />
						<Link href="#book-consultation" className="bg-[#1754cf] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all">
							Book Consultation
						</Link>
					</nav>

					{/* Language switcher */}
					<div className="flex items-center bg-gray-100 p-1 rounded-full">
						{locales.map((lng) => {
							const isActive = locale === lng;
							return (
								<Link key={lng} href={getLocalizedPath(lng)} className={["px-3 py-1 text-[10px] font-bold rounded-full transition-all", isActive ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"].join(" ")}>
									{lng.toUpperCase()}
								</Link>
							);
						})}
					</div>

					{/* Burger (mobile only, right-aligned) */}
					<button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100" aria-label="Open menu">
						<Menu size={22} />
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{open && (
				<div className="lg:hidden fixed inset-0 z-50 bg-white text-gray-900">
					<div className="h-[72px] flex items-center justify-between px-6 border-b">
						<Link href={`/${locale}`} className="flex items-center">
							<Image src="/images/logo.png" alt="Logo" width={128} height={32} className="object-contain" />
						</Link>
						<button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close menu">
							<X size={22} />
						</button>
					</div>

					<nav className="flex flex-col gap-6 px-6 py-8 text-lg font-medium">
						<NavLinks onClick={() => setOpen(false)} />

						<Link href="#book-consultation" onClick={() => setOpen(false)} className="mt-6 bg-[#1754cf] text-white text-center font-bold py-3 rounded-lg">
							Book Consultation
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
