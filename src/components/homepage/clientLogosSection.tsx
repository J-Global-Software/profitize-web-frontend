import Image from "next/image";

export default function ClientLogos() {
	const logos = [
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

	return (
		<section className="py-20 border-t border-gray-100">
			<div className="max-w-[1200px] mx-auto px-6 text-center">
				<p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">Empowering Global Market Leaders</p>

				<div className="flex flex-wrap justify-center items-center gap-12 md:gap-16  hover:opacity-100 hover:grayscale-0 transition-all duration-700">
					{logos.map((logo) => (
						<div key={logo.name} className="relative w-24 h-16 md:w-32 md:h-20 flex items-center justify-center">
							<Image src={logo.src} alt={`${logo.name} logo`} fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
