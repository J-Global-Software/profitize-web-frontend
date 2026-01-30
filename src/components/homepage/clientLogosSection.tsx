import { useTranslations } from "next-intl";
import Image from "next/image";

export default function ClientLogos() {
	const logos = [
		{ name: "Hilton", src: "/images/logos/hiltonLogo.jpg" },
		{ name: "Disney Resort", src: "/images/logos/Disneyresortlogo.jpg" },
		{ name: "Fujitsu", src: "/images/logos/Fujitsulogo.jpg" },
		{ name: "Hitachi", src: "/images/logos/hitachilogo.jpg" },
		{ name: "IDP", src: "/images/logos/idplogo.jpg" },
		{ name: "JR East Ads", src: "/images/logos/JReastAdslogo.jpg" },
		{ name: "Kyowa Kirin", src: "/images/logos/kkclogo.jpg" },
		{ name: "Kuroneko Yamato", src: "/images/logos/kuronekologo.jpg" },
		{ name: "Lexus", src: "/images/logos/lexuslogo.jpg" },
		{ name: "MyNavi", src: "/images/logos/mynavilogo.jpg" },
		{ name: "Nissan", src: "/images/logos/nissanlogo.jpg" },
		{ name: "Saatchi & Saatchi", src: "/images/logos/saatchilogo.jpg" },
		{ name: "Shane English School", src: "/images/logos/shanelogo.jpg" },
	];

	const t = useTranslations("homepage");

	// duplicate logos for seamless loop
	const loopLogos = [...logos, ...logos];

	return (
		<section className="py-20 border-t bg-white border-gray-100 overflow-hidden">
			<div className="max-w-[1200px] mx-auto px-6 text-center">
				<p
					className="font-bold text-3xl
				 text-gray-400 uppercase tracking-widest mb-12"
				>
					{t("clientLogos.title")}
				</p>

				<p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">{t("clientLogos.description")}</p>
			</div>

			{/* Marquee */}
			<div className="relative w-full overflow-hidden">
				<div className="flex w-max animate-logo-marquee hover:[animation-play-state:paused]">
					{loopLogos.map((logo, index) => (
						<div key={`${logo.name}-${index}`} className="mx-8 md:mx-12 flex items-center justify-center transition">
							<div className="relative w-24 h-16 md:w-32 md:h-20">
								<Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
