import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export function ErrorState({ message }: { message: string }) {
	const t = useTranslations("consultation");
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfb] px-4 text-center">
			<h1 className="text-3xl font-black text-gray-900 mb-4">{t("errors.oops")}</h1>
			<p className="text-gray-500 mb-6">{message}</p>
			<Link href="/" className="px-8 py-3 bg-[#1754cf] text-white rounded-xl font-semibold hover:bg-blue-600 transition-all">
				{t("common.returnHome")}
			</Link>
		</div>
	);
}
