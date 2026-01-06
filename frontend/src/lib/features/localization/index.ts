/**
 * Localization utility functions and re-exports for convenient usage across the app.
 */

export { getSupportedLanguage, i18n, getTranslation, t } from './i18nStore';

export type { Language } from './translations';
export { translations } from './translations';

export {
	formatDate,
	formatDateTime,
	formatTime,
	formatDateRelative,
	formatDateRange,
	formatRelativeTime,
	formatDuration,
	getWeekNumber,
	isFuture,
	isPast,
} from './dateFormatter';

export { QUICK_START_GUIDE } from './QuickStartGuide';

export { LOCALIZATION_README } from './README';
