/**
 * Date formatting utility that respects the current language setting.
 * Uses date-fns for locale-aware formatting.
 */

import {
	format as dfFormat,
	isToday,
	isYesterday,
	isTomorrow,
	isThisWeek,
	isThisMonth,
	isBefore,
	isAfter,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
} from 'date-fns';
import { da, enUS } from 'date-fns/locale';
import { i18n } from './i18nStore';
import type { Language } from './translations';

/**
 * Get date-fns locale object based on language
 */
function getDateLocale(lang: Language) {
	return lang === 'da' ? da : enUS;
}

/**
 * Format a date with the given format string respecting current language
 * @param date - Date to format
 * @param formatStr - date-fns format string (e.g., 'dd. MMM yyyy')
 * @param lang - Optional language override (uses current language if not provided)
 * @returns Formatted date string
 */
export function formatDate(date: Date | number, formatStr?: string, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const locale = getDateLocale(currentLang);

	// Use provided format or get from translations
	const format = formatStr || getDefaultDateFormat(currentLang);

	return dfFormat(date, format, { locale });
}

/**
 * Format date and time together
 * @param date - Date to format
 * @param lang - Optional language override
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | number, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const locale = getDateLocale(currentLang);

	const format = currentLang === 'da' ? 'dd. MMM yyyy HH:mm' : 'MMM dd, yyyy HH:mm';

	return dfFormat(date, format, { locale });
}

/**
 * Format time only (hours and minutes)
 * @param date - Date to format
 * @param lang - Optional language override
 * @returns Formatted time string
 */
export function formatTime(date: Date | number, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const locale = getDateLocale(currentLang);

	return dfFormat(date, 'HH:mm', { locale });
}

/**
 * Format date with smart relative labels (Today, Yesterday, etc.)
 * @param date - Date to format
 * @param lang - Optional language override
 * @returns Formatted date string with relative labels
 */
export function formatDateRelative(date: Date | number, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const dateObj = typeof date === 'number' ? new Date(date) : date;
	const now = new Date();
	const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

	if (isToday(dateObj)) {
		return currentLang === 'da' ? 'I dag' : 'Today';
	}

	if (isYesterday(dateObj)) {
		return currentLang === 'da' ? 'I går' : 'Yesterday';
	}

	if (isTomorrow(dateObj)) {
		return currentLang === 'da' ? 'I morgen' : 'Tomorrow';
	}

	if (isThisWeek(dateObj, { weekStartsOn: 1 })) {
		return currentLang === 'da' ? 'Denne uge' : 'This week';
	}

	if (isAfter(dateObj, oneMonthAgo) && isBefore(dateObj, now)) {
		return currentLang === 'da' ? 'Sidste uge' : 'Last week';
	}

	if (isThisMonth(dateObj)) {
		return currentLang === 'da' ? 'Denne måned' : 'This month';
	}

	if (isBefore(dateObj, now) && isAfter(dateObj, new Date(now.getFullYear(), now.getMonth() - 1, 1))) {
		return currentLang === 'da' ? 'Sidste måned' : 'Last month';
	}

	// Fallback to regular date format
	return formatDate(dateObj, undefined, currentLang);
}

/**
 * Get the default date format for a language
 * @param lang - Language
 * @returns Format string
 */
function getDefaultDateFormat(lang: Language): string {
	return lang === 'da' ? 'dd. MMM yyyy' : 'MMM dd, yyyy';
}

/**
 * Format a date range
 * @param startDate - Start date
 * @param endDate - End date
 * @param lang - Optional language override
 * @returns Formatted date range string (e.g., "15. Jan - 20. Jan 2024")
 */
export function formatDateRange(
	startDate: Date | number,
	endDate: Date | number,
	lang?: Language,
): string {
	const currentLang = lang || i18n.getLanguage();

	const start = formatDate(startDate, undefined, currentLang);
	const end = formatDate(endDate, undefined, currentLang);

	const separator = currentLang === 'da' ? ' - ' : ' - ';
	return `${start}${separator}${end}`;
}

/**
 * Get the week number of a date
 * @param date - Date
 * @returns Week number (1-53)
 */
export function getWeekNumber(date: Date | number): number {
	const dateObj = typeof date === 'number' ? new Date(date) : date;
	const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
	const pastDaysOfYear = (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Check if a date is in the future
 * @param date - Date to check
 * @returns true if date is in the future
 */
export function isFuture(date: Date | number): boolean {
	const dateObj = typeof date === 'number' ? new Date(date) : date;
	return dateObj.getTime() > new Date().getTime();
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns true if date is in the past
 */
export function isPast(date: Date | number): boolean {
	const dateObj = typeof date === 'number' ? new Date(date) : date;
	return dateObj.getTime() < new Date().getTime();
}

/**
 * Get a human-readable relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to compare to now
 * @param lang - Optional language override
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | number, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const dateObj = typeof date === 'number' ? new Date(date) : date;
	const now = new Date();
	const diffMs = dateObj.getTime() - now.getTime();
	const diffSecs = Math.round(diffMs / 1000);
	const diffMins = Math.round(diffSecs / 60);
	const diffHours = Math.round(diffMins / 60);
	const diffDays = Math.round(diffHours / 24);

	if (currentLang === 'da') {
		if (Math.abs(diffSecs) < 60) return 'netop nu';
		if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)} min ${diffMins < 0 ? 'siden' : 'fra nu'}`;
		if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} timer ${diffHours < 0 ? 'siden' : 'fra nu'}`;
		if (Math.abs(diffDays) < 30) return `${Math.abs(diffDays)} dage ${diffDays < 0 ? 'siden' : 'fra nu'}`;
		return formatDate(dateObj, undefined, currentLang);
	} else {
		// English
		if (Math.abs(diffSecs) < 60) return 'just now';
		if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)} min ${diffMins < 0 ? 'ago' : 'from now'}`;
		if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} hours ${diffHours < 0 ? 'ago' : 'from now'}`;
		if (Math.abs(diffDays) < 30) return `${Math.abs(diffDays)} days ${diffDays < 0 ? 'ago' : 'from now'}`;
		return formatDate(dateObj, undefined, currentLang);
	}
}

/**
 * Format a duration in milliseconds to human-readable format
 * @param durationMs - Duration in milliseconds
 * @param lang - Optional language override
 * @returns Duration string (e.g., "2h 30m")
 */
export function formatDuration(durationMs: number, lang?: Language): string {
	const currentLang = lang || i18n.getLanguage();
	const totalSeconds = Math.round(durationMs / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(`${hours}${currentLang === 'da' ? 't' : 'h'}`);
	}

	if (minutes > 0 || hours === 0) {
		parts.push(`${minutes}${currentLang === 'da' ? 'm' : 'm'}`);
	}

	if (seconds > 0 && hours === 0) {
		parts.push(`${seconds}${currentLang === 'da' ? 's' : 's'}`);
	}

	return parts.join(' ');
}
