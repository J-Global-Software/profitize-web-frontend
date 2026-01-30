"use client";

import { useTranslations } from "next-intl";
import { WorkshopBlock } from "./workshopCard";

export default function Resources() {
	const t = useTranslations("homepage");

	const workshops = [{ key: "w1" }, { key: "w2" }, { key: "w3" }, { key: "w4" }];

	return (
		<section className="bg-[#f7f9fc] py-20" id="resources">
			<div className="max-w-[1200px] mx-auto px-6">
				{/* Header */}

				<h2 className="mt-4 text-4xl md:text-5xl  font-black leading-tight text-gray-900 mb-15">{t("resources.header")}</h2>

				{/* Board */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{workshops.map((workshop) => (
						<WorkshopBlock key={workshop.key} t={t} workshop={workshop} />
					))}
				</div>
			</div>
		</section>
	);
}
