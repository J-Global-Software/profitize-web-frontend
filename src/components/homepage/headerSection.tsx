"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/src/i18n/navigation";

// --- React Icons Imports ---
import { HiMenu, HiX } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";

const locales = ["en", "ja"] as const;
type Locale = (typeof locales)[number];

/**
 * 1. Move NavLinks outside the main component to prevent re-creation on every render.
 * This fixes the 'react-hooks/static-components' warning.
 */
interface NavLinksProps {
	t: (key: string) => string;
	onClick?: () => void;
}

const NavLinks = ({ t, onClick }: NavLinksProps) => (
	<>
		<Link href="#who-we-help" onClick={onClick} className="text-gray-900 hover:text-[#1754cf] transition-colors">
			{t("header.nav.whoWeHelp")}
		</Link>
		<Link href="#industries" onClick={onClick} className="text-gray-900 hover:text-[#1754cf] transition-colors">
			{t("header.nav.industries")}
		</Link>
		<Link href="#services" onClick={onClick} className="text-gray-900 hover:text-[#1754cf] transition-colors">
			{t("header.nav.services")}
		</Link>
		<Link href="#resources" onClick={onClick} className="text-gray-900 hover:text-[#1754cf] transition-colors">
			{t("header.nav.resources")}
		</Link>
	</>
);

export default function Header() {
	const locale = useLocale() as Locale;
	const t = useTranslations("homepage");
	const pathname = usePathname();
	const router = useRouter();

	const [menuOpen, setMenuOpen] = useState(false);
	const [langOpen, setLangOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setLangOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLanguageChange = (lng: string) => {
		const segments = pathname.split("/").filter(Boolean);

		// Type-safe check for locale segment
		const firstSegmentIsLocale = (locales as readonly string[]).includes(segments[0]);

		if (firstSegmentIsLocale) {
			segments[0] = lng;
		} else {
			segments.unshift(lng);
		}

		router.replace("/" + segments.join("/"));
		setLangOpen(false);
		setMenuOpen(false);
	};

	const getLanguageName = (lng: string) => {
		switch (lng) {
			case "en":
				return "English";
			case "ja":
				return "日本語";
			default:
				return lng;
		}
	};

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-[#f0f2f4]">
			<div className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between px-6">
				<Link href="/" aria-label={t("header.aria.home")} className="flex items-center">
					<Image src="/images/logo.png" alt="Global Consulting" width={128} height={32} className="object-contain" priority />
				</Link>

				<div className="flex items-center gap-3">
					<nav className="hidden lg:flex items-center gap-8">
						{/* Pass translation function to child */}
						<NavLinks t={t} />
						<Link href="/free-consultation" className="bg-[#1754cf] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all">
							{t("header.cta.bookConsultation")}
						</Link>
					</nav>

					{/* Desktop Language Selector */}
					<div className="hidden lg:flex relative" ref={dropdownRef}>
						<button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-[#1754cf] transition-all duration-200">
							<Image src={`/images/flags/${locale}.png`} alt={locale} width={20} height={14} className="rounded-sm object-cover" />
							<span className="text-gray-700 text-sm font-medium">{getLanguageName(locale)}</span>
							<HiChevronDown className={`text-gray-600 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} size={18} />
						</button>

						{langOpen && (
							<div className="absolute right-0 z-50 mt-2 w-36 rounded-lg bg-white shadow-lg border border-gray-100 overflow-hidden">
								<ul className="py-1">
									{locales.map((lng) => (
										<li key={lng}>
											<button onClick={() => handleLanguageChange(lng)} className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${locale === lng ? "bg-[#1754cf]/10 font-medium text-[#1754cf]" : "hover:bg-gray-50 text-gray-700"}`}>
												<Image src={`/images/flags/${lng}.png`} alt={lng} width={20} height={14} className="rounded-sm object-cover mr-2" />
												{getLanguageName(lng)}
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<button onClick={() => setMenuOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-700" aria-label={t("header.aria.openMenu")}>
						<HiMenu size={26} />
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{menuOpen && (
				<div className="lg:hidden fixed inset-0 z-50 bg-white text-gray-900 flex flex-col">
					<div className="h-[72px] flex items-center justify-between px-6 border-b">
						<Link href={`/${locale}`} className="flex items-center">
							<Image src="/images/logo.png" alt="Logo" width={128} height={32} className="object-contain" />
						</Link>
						<button onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-100 text-gray-700" aria-label={t("header.aria.closeMenu")}>
							<HiX size={26} />
						</button>
					</div>

					<nav className="flex flex-col gap-6 px-6 py-8 text-lg font-medium flex-1">
						<NavLinks t={t} onClick={() => setMenuOpen(false)} />
						<Link href="/free-consultation" onClick={() => setMenuOpen(false)} className="mt-6 bg-[#1754cf] text-white text-center font-bold py-3 rounded-lg shadow-md">
							{t("header.cta.bookConsultation")}
						</Link>
						<div className="mt-auto mb-10 flex justify-center gap-3 flex-wrap">
							{locales.map((lng) => (
								<button key={lng} onClick={() => handleLanguageChange(lng)} className={`flex items-center px-4 py-2 rounded-lg text-sm border ${locale === lng ? "bg-[#1754cf]/10 text-[#1754cf] border-[#1754cf]/30 font-medium" : "bg-white border-gray-200 text-gray-700"}`}>
									<Image src={`/images/flags/${lng}.png`} alt={lng} width={20} height={14} className="rounded-sm object-cover mr-2" />
									{getLanguageName(lng)}
								</button>
							))}
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}
