export function getIsoDate(date: Date): string {
	const today = new Date(date);
	return today.toISOString().slice(0, 10);
}
