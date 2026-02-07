import { useState, useMemo } from "react";

export function useCalendarLogic(maxMonthsAhead: number) {
	const [currentMonth, setCurrentMonth] = useState(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});

	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	const maxDate = useMemo(() => {
		const d = new Date();
		d.setMonth(d.getMonth() + maxMonthsAhead);
		d.setHours(23, 59, 59, 999);
		return d;
	}, [maxMonthsAhead]);

	const calendarGrid = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1).getDay();
		const totalDays = new Date(year, month + 1, 0).getDate();

		const days = Array.from({ length: totalDays }, (_, i) => {
			const date = new Date(year, month, i + 1);
			return {
				day: i + 1,
				date,
				isDisabled: date < today || date > maxDate,
			};
		});

		return { firstDay, days };
	}, [currentMonth, today, maxDate]);

	const nav = {
		isCurrentMonth: currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth(),
		isMaxMonth: currentMonth.getFullYear() === maxDate.getFullYear() && currentMonth.getMonth() === maxDate.getMonth(),
		prev: () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)),
		next: () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)),
	};

	return { currentMonth, calendarGrid, nav };
}
