import { FaSpinner } from "react-icons/fa";

export function LoadingSpinner() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
			<FaSpinner className="animate-spin text-[#1754cf] w-8 h-8" />
		</div>
	);
}
