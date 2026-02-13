import FreeConsultationClient from "@/src/components/freeConsultation/freeConsultationClient";
import Header from "@/src/components/homepage/headerSection";
import { AppLocale } from "@/src/i18n/config";
import { constructMetadata } from "@/src/utils/metadata";

type Props = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: Props) {
	const { locale } = await params;
	return constructMetadata(locale, {
		namespace: "consultation.booking",
		pathname: "/free-consultation",
	});
}

export default function FreeConsultationPage() {
	return (
		<div>
			<Header />
			<FreeConsultationClient />;
		</div>
	);
}
