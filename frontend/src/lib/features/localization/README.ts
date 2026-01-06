/**
 * Comprehensive i18n (Internationalization) System Index
 *
 * This file serves as the central documentation and reference for the entire
 * localization system in GoPayShortcuts. It documents the architecture, all
 * exported components, translation keys, integration roadmap, and common workflows.
 *
 * @see index.ts - Main exports
 * @see i18nStore.ts - Language store and t() function
 * @see translations.ts - All translation strings (Danish & English)
 * @see dateFormatter.ts - Locale-aware date formatting
 * @see QuickStartGuide.ts - Step-by-step integration guide
 * @see COMPONENT_INTEGRATION_EXAMPLES.ts - Before/after code examples
 * @see LanguageSwitcher.svelte - Language switcher component
 */

export const LOCALIZATION_README = `
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              GoPayShortcuts i18n System - Complete Reference               ║
║                                                                            ║
║                    Internationalization for Danish & English               ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
1. OVERVIEW
═══════════════════════════════════════════════════════════════════════════════

WHAT IS THIS SYSTEM?
────────────────────
The localization system provides multi-language support for GoPayShortcuts,
allowing the application to display content in Danish (da) or English (en).

KEY FEATURES:
• Language auto-detection from browser settings
• Manual language switching with localStorage persistence
• Comprehensive translation strings for all UI elements
• Locale-aware date formatting using date-fns
• Type-safe translation key validation
• Real-time language switching without page reload
• Fallback to Danish if translation is missing

SUPPORTED LANGUAGES:
• Danish (da) - Default language
• English (en) - Secondary language

BROWSER LANGUAGE AUTO-DETECTION:
────────────────────────────────
When a user visits the app for the first time:
1. Check localStorage for saved preference (key: 'language-preference')
2. If not saved, detect browser language via navigator.language
3. Map browser language codes to supported languages:
   - 'da' or 'da-*' (da-DK, da-GL) → Danish
   - 'en' or 'en-*' (en-US, en-GB) → English
   - Other languages → Default to Danish
4. Remember choice in localStorage for future visits

LOCALSTORAGE PERSISTENCE:
─────────────────────────
• Key: 'language-preference'
• Stores: 'da' or 'en'
• Auto-saved when language changes via i18n.setLanguage()
• Survives browser restarts and sessions
• Can be cleared to reset to browser detection


═══════════════════════════════════════════════════════════════════════════════
2. SYSTEM ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════════

COMPONENT ARCHITECTURE:
──────────────────────

┌─────────────────────────────────────────────────────────────────┐
│                    Svelte Component                             │
│  (uses i18n: <button>{t('auth.logout')}</button>)              │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ imports
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    index.ts (Main Exports)                      │
│  • t() - Get translation by key                                │
│  • i18n store - Language state & setLanguage()                 │
│  • formatDate() - Date formatting functions                    │
│  • Language type - 'da' | 'en'                                 │
└─────────────────────────────────────────────────────────────────┘
    │                           │                        │
    ├─ Re-exports from          │                        │
    │                           ▼                        ▼
    │              ┌──────────────────────┐ ┌──────────────────────┐
    │              │   i18nStore.ts       │ │ dateFormatter.ts     │
    │              │                      │ │                      │
    │              │ • i18n store         │ │ • formatDate()       │
    │              │ • t() function       │ │ • formatDateTime()   │
    │              │ • getLanguage()      │ │ • formatTime()       │
    │              │ • setLanguage()      │ │ • formatDateRange()  │
    │              │ • detectLanguage()   │ │ • formatDuration()   │
    │              │ • getTranslation()   │ │ • getWeekNumber()    │
    │              └────────────┬─────────┘ │ • isFuture/isPast()  │
    │                           │           └──────────────────────┘
    │                           ▼
    │              ┌──────────────────────┐
    │              │  translations.ts     │
    │              │                      │
    │              │ • da: {...}          │
    │              │   ├─ auth            │
    │              │   ├─ orders          │
    │              │   ├─ products        │
    │              │   ├─ locations       │
    │              │   ├─ menu            │
    │              │   ├─ common          │
    │              │   ├─ validation      │
    │              │   └─ dateTime        │
    │              │ • en: {...}          │
    │              │   └─ (same structure)
    │              └──────────────────────┘
    │
    └─ Used by → LanguageSwitcher.svelte
                 • Displays DA/EN buttons
                 • Calls i18n.setLanguage()
                 • Shows current language


DATA FLOW DIAGRAM:
──────────────────

User opens app
    │
    ▼
[Browser language detected]
    │
    ├─ Found in localStorage? ──YES──┐
    │                                │
    NO                               ▼
    │                        Set language from
    │                        localStorage
    │                                │
    └──────────────┬─────────────────┘
                   │
                   ▼
         i18n.setLanguage(lang)
                   │
                   ▼
         Update i18n store
         (currentLanguage = lang)
                   │
                   ▼
         Save to localStorage
         ('language-preference': lang)
                   │
                   ▼
    Svelte component re-renders
         with t('key')
                   │
                   ▼
    getTranslation(key, language)
                   │
                   ▼
    Look up in translations[lang]
                   │
    ┌──────────────┼──────────────┐
    │              │              │
   Found       Not found      Not found
    │              │              │
    ▼              ▼              ▼
  Return       Fallback to    Return key
  value        Danish (da)     as-is


HOW COMPONENTS REACT TO LANGUAGE CHANGES:
───────────────────────────────────────────

1. User clicks language switcher button
2. LanguageSwitcher calls i18n.setLanguage('en')
3. i18n store updates currentLanguage
4. All subscribed components re-render
5. t('key') functions return new language strings
6. UI updates instantly (no page reload)
7. localStorage persists the choice


═══════════════════════════════════════════════════════════════════════════════
3. CORE FILES REFERENCE
═══════════════════════════════════════════════════════════════════════════════

📄 index.ts (24 lines)
─────────────────────
PURPOSE: Main export point - single import source for all i18n functionality

EXPORTS:
• t(key: string): string
  └─ Get translation for any key
  └─ Automatically uses current language from store
  └─ Falls back to Danish if not found
  └─ Usage: {t('auth.email')}

• i18n: Readable<I18nState> & { setLanguage, t, getLanguage }
  └─ Main i18n store/service
  └─ Subscribe to language changes
  └─ Methods: setLanguage(lang), getLanguage(), t(key)

• getSupportedLanguage(lang: string): Language
  └─ Maps browser language code to 'da' or 'en'
  └─ Handles locale variants (da-DK → da)
  └─ Defaults to 'da' for unknown languages

• getTranslation(key: string, lang?: Language): string
  └─ Lower-level translation lookup
  └─ Direct access to translations by language
  └─ Useful for programmatic access

• translations: { da: {...}, en: {...} }
  └─ The entire translation object
  └─ Organized by feature (auth, orders, etc.)
  └─ Strongly typed for safety

• Language type: 'da' | 'en'
  └─ Type-safe language identifier

• All dateFormatter functions:
  └─ formatDate(), formatDateTime(), formatTime()
  └─ formatDateRelative(), formatDateRange()
  └─ formatRelativeTime(), formatDuration()
  └─ getWeekNumber(), isFuture(), isPast()


📄 i18nStore.ts (156 lines)
───────────────────────────
PURPOSE: Language state management, auto-detection, persistence

KEY FUNCTIONS:

getSupportedLanguage(lang: string): Language
├─ Input: Browser language code ('da-DK', 'en-US', 'sv', etc.)
├─ Output: 'da' or 'en'
├─ Logic:
│  ├─ Split by '-' to get base language
│  ├─ If base === 'da' → return 'da'
│  ├─ If base === 'en' → return 'en'
│  └─ Otherwise → return 'da' (default)
└─ Example: 'da-DK' → 'da', 'en-US' → 'en', 'sv' → 'da'

detectLanguage(): Language
├─ Detects user's preferred language
├─ Priority: localStorage > browser > 'da' (default)
├─ Steps:
│  ├─ Check if localStorage['language-preference'] exists
│  ├─ If yes, return saved value
│  ├─ Otherwise, detect navigator.language
│  ├─ Map to supported language via getSupportedLanguage()
│  └─ Default to 'da' on server-side
└─ Run once at app startup

i18n.setLanguage(lang: Language): void
├─ Changes current language to 'da' or 'en'
├─ Auto-saves to localStorage
├─ Triggers store update
├─ Causes all subscribed components to re-render
└─ Usage: <button onclick={() => i18n.setLanguage('en')}>English</button>

i18n.getLanguage(): Language
├─ Returns current language ('da' or 'en')
├─ O(1) lookup - instant
└─ Usage: if (i18n.getLanguage() === 'da') { ... }

i18n.t(key: string): string
├─ Shorthand for getTranslation(key, currentLanguage)
├─ Most common way to get translations in components
├─ Automatically uses current language
└─ Usage: {t('orders.title')}

getTranslation(key: string, lang?: Language): string
├─ Look up translation by dot-notation key
├─ Params:
│  ├─ key: e.g., 'auth.email', 'orders.title'
│  └─ lang: optional language override (defaults to 'da')
├─ Algorithm:
│  ├─ Split key by '.' to navigate nested object
│  ├─ Look up in translations[lang]
│  ├─ If found, return value
│  ├─ If not found:
│  │  ├─ If lang !== 'da', try Danish fallback
│  │  └─ Return key as last resort
│  └─ This prevents breaking if translations incomplete
└─ Example: getTranslation('auth.email', 'en') → 'Email address'

i18n Store Schema:
├─ currentLanguage: Language
├─ translations: { da: {...}, en: {...} }
└─ Readable store, use subscribe() to react to changes


📄 translations.ts (333 lines)
──────────────────────────────
PURPOSE: All UI strings for Danish and English

STRUCTURE:
export const translations = {
  da: {
    // Danish translations organized by feature
    auth: { ... },
    orders: { ... },
    products: { ... },
    locations: { ... },
    menu: { ... },
    common: { ... },
    validation: { ... },
    dateTime: { ... }
  },
  en: {
    // English translations - same structure as 'da'
    auth: { ... },
    orders: { ... },
    // ... etc
  }
}

ADDING NEW TRANSLATIONS:
1. Find the right feature section (auth, orders, etc.)
2. Add key to both translations.da[feature] and translations.en[feature]
3. Always add to BOTH languages
4. Use consistent naming (camelCase)
5. Keep values descriptive and concise
6. Example:
   da: { saveSuccess: 'Ordre blev gemt' }
   en: { saveSuccess: 'Order was saved' }


📄 dateFormatter.ts (243 lines)
───────────────────────────────
PURPOSE: Locale-aware date formatting using date-fns

KEY FUNCTIONS:

formatDate(date: Date | number, formatStr?: string, lang?: Language): string
├─ Formats date only (no time)
├─ Params:
│  ├─ date: Date object or timestamp
│  ├─ formatStr: Optional date-fns format (defaults to locale default)
│  └─ lang: Optional language override
├─ Danish: 'dd. MMM yyyy' → "15. Jan 2024"
├─ English: 'MMM dd, yyyy' → "Jan 15, 2024"
└─ Usage: <p>{formatDate(createdAt)}</p>

formatDateTime(date: Date | number, lang?: Language): string
├─ Formats date and time together
├─ Danish: "15. Jan 2024 14:30"
├─ English: "Jan 15, 2024 14:30"
└─ Usage: <p>{formatDateTime(createdAt)}</p>

formatTime(date: Date | number, lang?: Language): string
├─ Formats time only (hours and minutes)
├─ Format: 'HH:mm' → "14:30"
└─ Usage: <p>Time: {formatTime(date)}</p>

formatDateRelative(date: Date | number, lang?: Language): string
├─ Smart relative formatting with locale labels
├─ Examples:
│  ├─ Today → "I dag" (da) or "Today" (en)
│  ├─ Yesterday → "I går" (da) or "Yesterday" (en)
│  ├─ This week → "Denne uge" (da) or "This week" (en)
│  ├─ Last month → "Sidste måned" (da) or "Last month" (en)
│  └─ Else → Full date format
└─ Usage: <p>{formatDateRelative(orderDate)}</p>

formatDateRange(startDate: Date | number, endDate: Date | number, lang?: Language): string
├─ Formats date range (e.g., "15. Jan - 20. Jan 2024")
└─ Usage: <p>Period: {formatDateRange(start, end)}</p>

formatRelativeTime(date: Date | number, lang?: Language): string
├─ Human-readable relative time
├─ Examples:
│  ├─ Danish: "2 timer siden", "3 dage fra nu"
│  ├─ English: "2 hours ago", "3 days from now"
│  └─ Handles past and future
└─ Usage: <p>{formatRelativeTime(date)}</p>

formatDuration(durationMs: number, lang?: Language): string
├─ Formats milliseconds to human-readable duration
├─ Examples:
│  ├─ Danish: "2t 30m" (2 timer 30 minutter)
│  ├─ English: "2h 30m"
│  └─ Always in locale-appropriate format
└─ Usage: <p>Duration: {formatDuration(5400000)}</p>

getWeekNumber(date: Date | number): number
├─ Returns ISO week number (1-53)
└─ Usage: const week = getWeekNumber(date)

isFuture(date: Date | number): boolean
├─ Check if date is in the future
└─ Usage: {#if isFuture(orderDate)} ... {/if}

isPast(date: Date | number): boolean
├─ Check if date is in the past
└─ Usage: {#if isPast(orderDate)} ... {/if}


═══════════════════════════════════════════════════════════════════════════════
4. USAGE FILES (REFERENCE DOCUMENTS)
═══════════════════════════════════════════════════════════════════════════════

📄 QuickStartGuide.ts
─────────────────────
WHAT: Step-by-step integration guide for developers

INCLUDES:
• 5-minute quick start with copy-paste examples
• 6-phase integration plan (Main Layout → Testing)
• 5 common patterns (Labels, Errors, Buttons, Accessibility, Conditionals)
• File structure and import statements
• Testing checklist for both languages
• Troubleshooting section with solutions
• Quick reference cheat sheet
• Key principles for i18n usage

TIME ESTIMATES:
• Phase 1 (Main Layout): 5 minutes
• Phase 2 (Auth): 15 minutes
• Phase 3 (Orders): 30 minutes
• Phase 4 (Other): 1-2 hours
• Phase 5 (Testing): 30 minutes

HOW TO USE:
1. Read this file first
2. Start with Phase 1
3. Copy-paste examples and adapt to your components
4. Test in both languages
5. Verify localStorage persistence


📄 COMPONENT_INTEGRATION_EXAMPLES.ts
────────────────────────────────────
WHAT: Detailed before/after code examples for real components

INCLUDES:
6 complete examples with:
1. AuthForm.svelte - Email/OTP form refactoring
2. OrderCard.svelte - Order display with notifications
3. DayViewTemplate.svelte - Navigation and messages
4. MainLayout.svelte - Header and logout button
5. Validation - Form validation messages
6. Store subscription - Advanced reactive patterns

EACH EXAMPLE SHOWS:
• Original hardcoded version (BEFORE)
• Refactored version using i18n (AFTER)
• Key patterns and benefits
• Copy-paste ready code

PATTERNS COVERED:
• Basic template usage with t()
• Using i18n in component logic
• Conditional strings with i18n
• Accessibility with i18n (aria-labels)
• Parameterized validation messages
• Store subscription (advanced)
• Language switcher implementation
• Implementation checklist

HOW TO USE:
1. Find example matching your component type
2. Copy AFTER code and adapt
3. Replace hardcoded strings with t() calls
4. Add translation keys to translations.ts
5. Test in both languages


📄 LanguageSwitcher.svelte (80 lines)
──────────────────────────────────────
WHAT: Reusable language switcher component

FEATURES:
• Toggle between Danish (DA) and English (EN)
• Visual indicator of current language (blue highlight)
• Styled with Tailwind CSS
• Responsive and accessible
• Shows 'aria-pressed' state
• Smooth transitions
• Dark mode support

USAGE:
<script lang="ts">
  import LanguageSwitcher from '$lib/components/molecules/LanguageSwitcher.svelte';
</script>

<header>
  <LanguageSwitcher />
</header>

CUSTOMIZATION:
You can modify:
• Colors: Change 'bg-blue-500' to different color
• Size: Adjust px-3 py-1.5 for button padding
• Text: Change 'DA' and 'EN' to full labels
• Styling: Adapt Tailwind classes for your design


═══════════════════════════════════════════════════════════════════════════════
5. API REFERENCE - All Exported Functions
═══════════════════════════════════════════════════════════════════════════════

TRANSLATION FUNCTION:
══════════════════════

t(key: string): string
├─ Get a translation string by key
├─ Uses current language from i18n store
├─ Parameters:
│  └─ key: Dot-notation key (e.g., 'auth.email', 'orders.title')
├─ Returns:
│  ├─ Translated string if found
│  ├─ Danish fallback if not in current language
│  └─ Key itself as last resort if not found anywhere
├─ Performance: O(1) - instant lookup
├─ Safe to call frequently
└─ Examples:
   ├─ t('auth.email') → 'Email adresse' (da) or 'Email address' (en)
   ├─ t('orders.save') → 'Gem ordre' (da) or 'Save order' (en)
   └─ t('common.loading') → 'Indlæser...' (da) or 'Loading...' (en)

USAGE IN TEMPLATES:
──────────────────

<button>{t('common.save')}</button>
<label for="email">{t('auth.emailLabel')}</label>
<input placeholder={t('auth.emailPlaceholder')} />
{#if isLoading}
  <p>{t('auth.sending')}</p>
{/if}

USAGE IN COMPONENT LOGIC:
─────────────────────────

import { t } from '$lib/features/localization';
import { notifications } from '$lib/core/notifications/notificationStore';

async function handleSave() {
  try {
    await saveOrder();
    notifications.success(t('orders.saveSuccess'));
  } catch (err) {
    notifications.error(t('orders.saveError'));
  }
}


STORE METHODS:
═══════════════

i18n.setLanguage(lang: Language): void
├─ Switch the current language
├─ Parameters:
│  └─ lang: 'da' (Danish) or 'en' (English)
├─ Effects:
│  ├─ Updates current language
│  ├─ Saves to localStorage
│  ├─ Triggers store updates
│  └─ Components re-render with new language
├─ Performance: O(1) - instant
└─ Examples:
   ├─ i18n.setLanguage('en') // Switch to English
   ├─ i18n.setLanguage('da') // Switch to Danish
   └─ <button onclick={() => i18n.setLanguage('en')}>English</button>

i18n.getLanguage(): Language
├─ Get the current language
├─ Returns: 'da' or 'en'
├─ Performance: O(1) - instant
├─ Always accurate (no caching issues)
└─ Examples:
   ├─ if (i18n.getLanguage() === 'da') { ... }
   ├─ const lang = i18n.getLanguage() // 'da' or 'en'
   └─ <p>Current: {i18n.getLanguage()}</p>


STORE SUBSCRIPTION:
════════════════════

i18n.subscribe(callback: (state: I18nState) => void): () => void
├─ Subscribe to language changes
├─ Parameters:
│  └─ callback: Function called when language changes
├─ Returns:
│  └─ Unsubscribe function to stop listening
├─ State object:
│  ├─ currentLanguage: 'da' | 'en'
│  └─ translations: { da: {...}, en: {...} }
├─ Advanced pattern - usually not needed for simple components
└─ Example:
   const unsubscribe = i18n.subscribe((state) => {
     console.log('Language changed to:', state.currentLanguage);
   });
   // Call unsubscribe() to stop listening

REACTIVE USAGE IN SVELTE 5:
────────────────────────────

// Get current language reactively
let currentLanguage = $derived(i18n.getLanguage());

// Derive computed translations
let statusMessage = $derived.by(() => {
  if (order.status === 'pending') {
    return t('orders.status.pending');
  } else {
    return t('orders.status.completed');
  }
});

// In templates
{#if currentLanguage === 'da'}
  <p>Dansk indhold</p>
{:else}
  <p>English content</p>
{/if}


DATE FORMATTING FUNCTIONS:
════════════════════════════

formatDate(date: Date | number, formatStr?: string, lang?: Language): string
├─ Format a date
├─ Parameters:
│  ├─ date: Date object or timestamp (ms)
│  ├─ formatStr: Optional date-fns format string
│  └─ lang: Optional language override
├─ Returns: Formatted date string
├─ Defaults:
│  ├─ Danish: 'dd. MMM yyyy' → "15. Jan 2024"
│  └─ English: 'MMM dd, yyyy' → "Jan 15, 2024"
└─ Examples:
   ├─ formatDate(new Date()) → "15. Jan 2024" (da)
   ├─ formatDate(createdAt, 'yyyy-MM-dd') → "2024-01-15"
   └─ formatDate(date, 'dd/MM/yyyy', 'da') → "15/01/2024"

formatDateTime(date: Date | number, lang?: Language): string
├─ Format date and time together
├─ Returns:
│  ├─ Danish: "15. Jan 2024 14:30"
│  └─ English: "Jan 15, 2024 14:30"
└─ Example: <p>{formatDateTime(orderDate)}</p>

formatTime(date: Date | number, lang?: Language): string
├─ Format time only
├─ Returns: "14:30" (HH:mm format)
└─ Example: <p>Time: {formatTime(now)}</p>

formatDateRelative(date: Date | number, lang?: Language): string
├─ Smart relative formatting
├─ Examples:
│  ├─ Today → "I dag" (da) or "Today" (en)
│  ├─ Yesterday → "I går" (da) or "Yesterday" (en)
│  ├─ Tomorrow → "I morgen" (da) or "Tomorrow" (en)
│  ├─ This week → "Denne uge" (da) or "This week" (en)
│  ├─ Last week → "Sidste uge" (da) or "Last week" (en)
│  ├─ This month → "Denne måned" (da) or "This month" (en)
│  ├─ Last month → "Sidste måned" (da) or "Last month" (en)
│  └─ Else → Full date format
└─ Example: <p>{formatDateRelative(orderDate)}</p>

formatDateRange(startDate: Date | number, endDate: Date | number, lang?: Language): string
├─ Format a range of dates
├─ Returns: "15. Jan - 20. Jan 2024" (both in same locale)
└─ Example: <p>Period: {formatDateRange(start, end)}</p>

formatRelativeTime(date: Date | number, lang?: Language): string
├─ Human-readable relative time
├─ Examples:
│  ├─ Danish: "netop nu", "2 min siden", "3 timer fra nu"
│  ├─ English: "just now", "2 min ago", "3 hours from now"
│  └─ Handles both past and future dates
└─ Example: <p>Updated: {formatRelativeTime(lastUpdate)}</p>

formatDuration(durationMs: number, lang?: Language): string
├─ Format duration from milliseconds
├─ Examples:
│  ├─ Danish: "2t 30m", "45m", "30s"
│  ├─ English: "2h 30m", "45m", "30s"
│  └─ Adapts format based on magnitude
└─ Example: <p>Duration: {formatDuration(5400000)}</p>

getWeekNumber(date: Date | number): number
├─ Get ISO week number
├─ Returns: 1-53
└─ Example: Week {getWeekNumber(date)}

isFuture(date: Date | number): boolean
├─ Check if date is in the future
└─ Example: {#if isFuture(date)} Upcoming {/if}

isPast(date: Date | number): boolean
├─ Check if date is in the past
└─ Example: {#if isPast(date)} Completed {/if}


TYPE EXPORTS:
═══════════════

export type Language = 'da' | 'en'
├─ Type-safe language identifier
├─ Use in function parameters
└─ Example: function setLang(lang: Language) { ... }


═══════════════════════════════════════════════════════════════════════════════
6. TRANSLATION KEYS - Organized by Feature
═══════════════════════════════════════════════════════════════════════════════

AUTH (12 keys):
───────────────
• auth.email - 'Email adresse' / 'Email address'
• auth.emailPlaceholder - 'Indtast din email' / 'Enter your email'
• auth.emailLabel - 'Email' / 'Email'
• auth.verificationCode - 'Verifikationskode' / 'Verification code'
• auth.verificationPlaceholder - 'Indtast verifikationskode' / 'Enter verification code'
• auth.verificationCodeLabel - 'Verifikationskode' / 'Verification code'
• auth.continue - 'Fortsæt' / 'Continue'
• auth.login - 'Log ind' / 'Sign in'
• auth.logout - 'Log ud' / 'Sign out'
• auth.back - 'Tilbage' / 'Back'
• auth.sending - 'Sender...' / 'Sending...'
• auth.verifying - 'Verificerer...' / 'Verifying...'


ORDERS (11 keys):
─────────────────
• orders.title - 'Ordrer' / 'Orders'
• orders.orderNumber - 'Ordre nummer' / 'Order number'
• orders.date - 'Dato' / 'Date'
• orders.total - 'I alt' / 'Total'
• orders.status - 'Status' / 'Status'
• orders.actions - 'Handlinger' / 'Actions'
• orders.view - 'Se detaljer' / 'View details'
• orders.delete - 'Slet' / 'Delete'
• orders.edit - 'Rediger' / 'Edit'
• orders.create - 'Opret ordre' / 'Create order'
• orders.save - 'Gem ordre' / 'Save order'


PRODUCTS (7 keys):
──────────────────
• products.title - 'Produkter' / 'Products'
• products.productName - 'Produktnavn' / 'Product name'
• products.price - 'Pris' / 'Price'
• products.quantity - 'Mængde' / 'Quantity'
• products.description - 'Beskrivelse' / 'Description'
• products.addProduct - 'Tilføj produkt' / 'Add product'
• products.removeProduct - 'Fjern produkt' / 'Remove product'


LOCATIONS (9 keys):
───────────────────
• locations.title - 'Lokationer' / 'Locations'
• locations.name - 'Navn' / 'Name'
• locations.address - 'Adresse' / 'Address'
• locations.city - 'By' / 'City'
• locations.zipCode - 'Postnummer' / 'Zip code'
• locations.phone - 'Telefon' / 'Phone'
• locations.addLocation - 'Tilføj lokation' / 'Add location'
• locations.editLocation - 'Rediger lokation' / 'Edit location'
• locations.deleteLocation - 'Slet lokation' / 'Delete location'


MENU (8 keys):
──────────────
• menu.home - 'Forside' / 'Home'
• menu.orders - 'Ordrer' / 'Orders'
• menu.products - 'Produkter' / 'Products'
• menu.locations - 'Lokationer' / 'Locations'
• menu.settings - 'Indstillinger' / 'Settings'
• menu.profile - 'Profil' / 'Profile'
• menu.help - 'Hjælp' / 'Help'
• menu.aboutUs - 'Om os' / 'About us'


COMMON (24 keys):
─────────────────
• common.loading - 'Indlæser...' / 'Loading...'
• common.error - 'Der opstod en fejl' / 'An error occurred'
• common.success - 'Succes' / 'Success'
• common.warning - 'Advarsel' / 'Warning'
• common.info - 'Information' / 'Information'
• common.yes - 'Ja' / 'Yes'
• common.no - 'Nej' / 'No'
• common.ok - 'OK' / 'OK'
• common.close - 'Luk' / 'Close'
• common.confirm - 'Bekræft' / 'Confirm'
• common.cancel - 'Annuller' / 'Cancel'
• common.save - 'Gem' / 'Save'
• common.delete - 'Slet' / 'Delete'
• common.edit - 'Rediger' / 'Edit'
• common.add - 'Tilføj' / 'Add'
• common.remove - 'Fjern' / 'Remove'
• common.search - 'Søg' / 'Search'
• common.filter - 'Filtrer' / 'Filter'
• common.sort - 'Sorter' / 'Sort'
• common.export - 'Eksporter' / 'Export'
• common.import - 'Importer' / 'Import'
• common.refresh - 'Opdater' / 'Refresh'
• common.back - 'Tilbage' / 'Back'
• common.next - 'Næste' / 'Next'


VALIDATION (9 keys):
────────────────────
• validation.required - 'Dette felt er påkrævet' / 'This field is required'
• validation.email - 'Venligst indtast en gyldig email adresse' / 'Please enter a valid email address'
• validation.minLength - 'Skal være mindst {0} tegn' / 'Must be at least {0} characters'
• validation.maxLength - 'Kan være maksimalt {0} tegn' / 'Can be at most {0} characters'
• validation.pattern - 'Ugyldigt format' / 'Invalid format'
• validation.number - 'Skal være et tal' / 'Must be a number'
• validation.positive - 'Skal være et positivt tal' / 'Must be a positive number'
• validation.url - 'Skal være en gyldig URL' / 'Must be a valid URL'
• validation.phone - 'Skal være et gyldigt telefonnummer' / 'Must be a valid phone number'


DATETIME (8 keys):
──────────────────
• dateTime.formatDate - 'dd. MMM yyyy' / 'MMM dd, yyyy' (Format strings)
• dateTime.formatDateTime - 'dd. MMM yyyy HH:mm' / 'MMM dd, yyyy HH:mm'
• dateTime.formatTime - 'HH:mm' / 'HH:mm'
• dateTime.today - 'I dag' / 'Today'
• dateTime.yesterday - 'I går' / 'Yesterday'
• dateTime.tomorrow - 'I morgen' / 'Tomorrow'
• dateTime.thisWeek - 'Denne uge' / 'This week'
• dateTime.lastWeek - 'Sidste uge' / 'Last week'


═══════════════════════════════════════════════════════════════════════════════
7. INTEGRATION ROADMAP
═══════════════════════════════════════════════════════════════════════════════

The localization system is already built and ready to use. Here's how to
integrate it into the rest of the application, phase by phase.

PHASE 1: MAIN LAYOUT (✓ Ready)
───────────────────────────────
Time: ~5 minutes
Files: +layout.svelte

TASKS:
1. Import LanguageSwitcher component
2. Add to header/navigation
3. Localize header labels
4. Localize navigation menu items

Example:
import LanguageSwitcher from '$lib/components/molecules/LanguageSwitcher.svelte';
import { t } from '$lib/features/localization';

<nav>
  <a href="/">{t('menu.home')}</a>
  <a href="/orders">{t('menu.orders')}</a>
  <LanguageSwitcher />
</nav>

STATUS: Ready for integration


PHASE 2: AUTHENTICATION PAGES (✓ Ready)
────────────────────────────────────────
Time: ~15 minutes
Files:
• routes/login/+page.svelte
• lib/features/auth/pages/EmailStep.svelte
• lib/features/auth/pages/CodeStep.svelte

TASKS:
1. Replace hardcoded form labels
2. Replace hardcoded placeholders
3. Localize button text
4. Localize error messages
5. Update aria-labels for accessibility

Example:
<label for="email">{t('auth.emailLabel')}</label>
<input placeholder={t('auth.emailPlaceholder')} />
<button>{#if isLoading}{t('auth.sending')}{:else}{t('auth.continue')}{/if}</button>

STATUS: Ready for integration


PHASE 3: ORDERS FEATURE (✓ Ready)
──────────────────────────────────
Time: ~30 minutes
Files:
• routes/orders/+page.svelte
• lib/features/orders/organisms/OrderCard.svelte
• lib/features/orders/templates/DayViewTemplate.svelte
• lib/features/orders/molecules/OrderForm.svelte

TASKS:
1. Localize table headers
2. Localize status messages
3. Add formatDate() for order dates
4. Localize notification messages
5. Update validation messages
6. Localize button labels

Example:
<th>{t('orders.orderNumber')}</th>
<th>{t('orders.date')}</th>
<p>{formatDate(order.createdAt)}</p>
notifications.success(t('orders.saveSuccess'));

STATUS: Ready for integration


PHASE 4: PRODUCTS & LOCATIONS (✓ Ready)
─────────────────────────────────────────
Time: ~45 minutes
Files:
• Product list, cards, forms
• Location list, cards, forms

TASKS:
1. Localize all labels
2. Localize validation messages
3. Localize notification messages
4. Update button text

STATUS: Ready for integration


PHASE 5: SETTINGS & PROFILE (✓ Ready)
───────────────────────────────────────
Time: ~30 minutes
Files:
• Settings pages
• Profile pages
• Preferences

TASKS:
1. Localize setting names
2. Localize descriptions
3. Localize validation messages
4. Update form labels

STATUS: Ready for integration


PHASE 6: TESTING & VERIFICATION (✓ Ready)
────────────────────────────────────────────
Time: ~30-45 minutes

TASKS:
1. Test all pages in Danish
2. Test all pages in English
3. Test language switching
4. Verify localStorage persistence
5. Test browser language detection
6. Test with different text lengths
7. Run accessibility tests
8. Verify no missing translations

CHECKLIST:
☐ All pages render without errors
☐ All text appears in correct language
☐ Language switching works instantly
☐ Dates format correctly in both languages
☐ Validation messages appear in correct language
☐ Accessibility features are translated
☐ localStorage preference persists
☐ Browser language detection works
☐ No console errors or warnings
☐ All components tested in both languages

STATUS: Ready to execute


═══════════════════════════════════════════════════════════════════════════════
8. BROWSER LANGUAGE DETECTION
═══════════════════════════════════════════════════════════════════════════════

HOW IT WORKS:
──────────────

1. DETECTION SEQUENCE:
   
   First Visit (No localStorage):
   ├─ Read navigator.language from browser
   ├─ Examples: 'da-DK', 'en-US', 'sv-SE', 'de-DE'
   └─ Map to supported language via getSupportedLanguage()

2. LANGUAGE MAPPING:
   
   getSupportedLanguage(browserLang: string): Language
   ├─ Extract base language: 'da-DK' → 'da'
   ├─ Check if base === 'da' → return 'da'
   ├─ Check if base === 'en' → return 'en'
   └─ Otherwise → return 'da' (default)

3. SUPPORTED MAPPINGS:
   
   Danish:
   ├─ 'da' → 'da' (Danish generic)
   ├─ 'da-DK' → 'da' (Danish - Denmark)
   ├─ 'da-GL' → 'da' (Danish - Greenland)
   └─ Any other 'da-*' → 'da'
   
   English:
   ├─ 'en' → 'en' (English generic)
   ├─ 'en-US' → 'en' (English - USA)
   ├─ 'en-GB' → 'en' (English - UK)
   ├─ 'en-AU' → 'en' (English - Australia)
   └─ Any other 'en-*' → 'en'
   
   Other Languages (Default to Danish):
   ├─ 'sv-SE' → 'da' (Swedish defaults to Danish)
   ├─ 'de-DE' → 'da' (German defaults to Danish)
   ├─ 'fr-FR' → 'da' (French defaults to Danish)
   └─ Any unsupported → 'da'

4. FIRST VISIT FLOW:
   
   Browser: 'en-US'
        │
        ▼
   navigator.language = 'en-US'
        │
        ▼
   getSupportedLanguage('en-US')
        │
        ▼
   Extract 'en'
        │
        ▼
   Return 'en'
        │
        ▼
   i18n.setLanguage('en')
        │
        ▼
   Save to localStorage['language-preference'] = 'en'
        │
        ▼
   UI loads in English

5. SUBSEQUENT VISITS:
   
   Check localStorage first
        │
        ├─ Found? → Use saved language
        │
        └─ Not found? → Repeat detection

6. DEFAULT FALLBACK:
   
   Server-side rendering or if localStorage unavailable
        │
        └─ Default to 'da' (Danish)


═══════════════════════════════════════════════════════════════════════════════
9. LOCALSTORAGE PERSISTENCE
═══════════════════════════════════════════════════════════════════════════════

STORAGE DETAILS:
─────────────────

Key: 'language-preference'
Values: 'da' or 'en'
Scope: Domain-specific (survives across tabs/windows of same domain)
Lifetime: Until manually cleared (survives browser restart)

WHEN SAVED:
────────────

Automatically saved when:
1. User clicks language switcher (i18n.setLanguage() called)
2. App detects browser language on first visit
3. User manually calls i18n.setLanguage(lang)

WHEN LOADED:
─────────────

Automatically loaded when:
1. App initializes (detectLanguage() called)
2. Component mounts (i18n store subscription)
3. Page refreshes or navigates

CLEARING PREFERENCE:
──────────────────

To reset to browser language detection:
1. Developer console: localStorage.removeItem('language-preference')
2. Clear all browser data (clears localStorage)
3. Open DevTools → Storage → Clear all

CHECKING SAVED VALUE:
──────────────────────

In browser console:
localStorage.getItem('language-preference')
// Returns: 'da', 'en', or null

VIEW ALL STORAGE:
─────────────────

In browser DevTools:
1. Open DevTools (F12)
2. Go to "Storage" or "Application" tab
3. Click "Local Storage"
4. Select your domain
5. Look for 'language-preference' key

PROGRAMMATIC ACCESS:
────────────────────

// Check if preference saved
const saved = localStorage.getItem('language-preference');
if (saved) {
  console.log('User preference:', saved);
} else {
  console.log('Using browser detection');
}

// Manually set preference
localStorage.setItem('language-preference', 'en');

// Clear preference
localStorage.removeItem('language-preference');


═══════════════════════════════════════════════════════════════════════════════
10. COMMON QUESTIONS & ANSWERS
═══════════════════════════════════════════════════════════════════════════════

Q1: HOW DO I ADD A NEW LANGUAGE?
─────────────────────────────────

A: Adding a new language requires changes to multiple files:

STEP 1: Add to translations.ts
└─ Add new language object with all keys

STEP 2: Update Language type in translations.ts
└─ type Language = 'da' | 'en' | 'sv' // add new language

STEP 3: Update getSupportedLanguage() in i18nStore.ts
└─ Add new language detection logic

STEP 4: Update dateFormatter.ts
└─ Add new locale import from date-fns
└─ Update getDateLocale() function
└─ Update date format strings

STEP 5: Update LanguageSwitcher.svelte
└─ Add new language button

Example for adding Swedish:
// translations.ts
export type Language = 'da' | 'en' | 'sv';

export const translations = {
  da: { ... },
  en: { ... },
  sv: {
    // All keys from da and en, translated to Swedish
    auth: { ... },
    orders: { ... },
    // ... etc
  }
}

// i18nStore.ts
export function getSupportedLanguage(lang: string): Language {
  const baseLang = lang.split('-')[0].toLowerCase();
  if (baseLang === 'da') return 'da';
  if (baseLang === 'en') return 'en';
  if (baseLang === 'sv') return 'sv';
  return 'da'; // default
}

Current plan: Danish and English only
Future: Can add more languages following above steps


Q2: HOW DO I ADD NEW TRANSLATION KEYS?
───────────────────────────────────────

A: Always add to BOTH languages simultaneously:

STEP 1: Identify the feature
└─ Is it auth? orders? products? etc.

STEP 2: Add to Danish translations
└─ translations.ts → da → feature → newKey

STEP 3: Add to English translations
└─ translations.ts → en → feature → newKey (same key)

STEP 4: Use in component
└─ {t('feature.newKey')} or t('feature.newKey')

STEP 5: Test in both languages
└─ Verify both languages work

Example:
// translations.ts
da: {
  orders: {
    ...existing,
    newKey: 'Danish translation'  // ✓ Add here
  }
},
en: {
  orders: {
    ...existing,
    newKey: 'English translation'  // ✓ AND here
  }
}

// Component
<button>{t('orders.newKey')}</button>

IMPORTANT: If you forget one language, the fallback system will try Danish.
Always verify both languages work after adding new keys.


Q3: HOW DO I TEST BOTH LANGUAGES?
──────────────────────────────────

A: Use these methods to test:

METHOD 1: Manual Testing with LanguageSwitcher
├─ Open app in browser
├─ Click LanguageSwitcher (DA/EN buttons)
├─ Verify all text updates instantly
├─ Close dev tools and check localStorage
├─ Refresh page → language persists

METHOD 2: Browser Language Settings
├─ Change browser language settings
├─ Clear localStorage
├─ Refresh page
├─ Verify app starts in correct language

METHOD 3: Developer Console
├─ Open browser DevTools (F12)
├─ Open console tab
├─ Type: localStorage.removeItem('language-preference')
├─ Type: i18n.setLanguage('en') // or 'da'
├─ Verify language changed

METHOD 4: Automated Testing
├─ Create test file
├─ Test component with Danish and English
├─ Verify t() returns correct strings
├─ Test language switching
├─ Example:

test('shows Danish text', () => {
  i18n.setLanguage('da');
  const text = t('orders.title');
  expect(text).toBe('Ordrer');
});

test('shows English text', () => {
  i18n.setLanguage('en');
  const text = t('orders.title');
  expect(text).toBe('Orders');
});

CHECKLIST:
☐ Click language switcher, all UI updates
☐ Refresh page, language persists
☐ Clear localStorage, app uses browser language
☐ Test with Danish browser settings
☐ Test with English browser settings
☐ No console errors in either language
☐ Dates format correctly in both languages
☐ All validation messages appear


Q4: WHAT IF A TRANSLATION IS MISSING?
──────────────────────────────────────

A: The system has built-in fallback behavior:

FALLBACK SEQUENCE:
1. Look for key in current language
2. If not found → Look in Danish (fallback)
3. If still not found → Return key as string (e.g., 'auth.email')

EXAMPLE:
// If 'orders.newKey' only exists in Danish:
i18n.setLanguage('en');
t('orders.newKey') // Returns Danish version (fallback)
               // Or 'orders.newKey' if nowhere

VISIBLE IN UI:
• If fully missing → Shows 'orders.newKey' literally
• This is easy to spot - looks like a bug
• Should never happen in production

SOLUTION:
Always add new keys to BOTH languages before deploying.
If you see a key in the UI, it means:
• Key exists in translations.ts
• But is missing from current language
• Add it immediately

HOW TO FIND MISSING KEYS:
1. Look at browser for text like 'orders.title'
2. Go to translations.ts
3. Search for that key
4. Add to missing language section
5. Restart dev server
6. Verify it shows translated text now


Q5: HOW DO I USE TRANSLATED STRINGS IN COMPONENT LOGIC?
─────────────────────────────────────────────────────────

A: Import t() and use it wherever needed:

IN EVENT HANDLERS:
<button onclick={() => showAlert(t('common.success'))}>
  {t('common.save')}
</button>

IN FUNCTIONS:
function handleSave() {
  const message = t('orders.saveSuccess');
  notifications.success(message);
}

IN NOTIFICATIONS:
async function save() {
  try {
    await saveOrder();
    notifications.success(t('orders.saveSuccess'));
  } catch (err) {
    notifications.error(t('orders.saveError'));
  }
}

IN VALIDATION:
function validateEmail(email: string): string | null {
  if (!email) return t('validation.required');
  if (!isValidEmail(email)) return t('validation.email');
  return null;
}

IN DERIVED STATE:
let statusMessage = \$derived.by(() => {
  if (isPending) return t('orders.pending');
  if (isCompleted) return t('orders.completed');
  return t('orders.unknown');
});

IMPORTANT: Call t() fresh each time or use derived, don't store in variables:
// ✗ WRONG - won't update when language changes
const label = t('auth.logout');

// ✓ RIGHT - updates when language changes
<button>{t('auth.logout')}</button>


Q6: HOW DO I ENSURE MY COMPONENT UPDATES WHEN LANGUAGE CHANGES?
────────────────────────────────────────────────────────────────

A: Use t() directly in templates, not in script:

✓ CORRECT - Will update:
<script>
  import { t } from '$lib/features/localization';
</script>
<h1>{t('orders.title')}</h1>

✗ WRONG - Won't update:
<script>
  import { t } from '$lib/features/localization';
  const title = t('orders.title'); // Stored!
</script>
<h1>{title}</h1>

FOR REACTIVE UPDATES:
Use derived state:
let title = \$derived(t('orders.title'));

Or:
let translations = \$derived.by(() => ({
  title: t('orders.title'),
  subtitle: t('orders.subtitle'),
  // ... more strings
}));


Q7: HOW DO I TRANSLATE ARIA-LABELS AND TITLES?
────────────────────────────────────────────────

A: Use t() the same way as visible text:

ARIA-LABELS:
<button aria-label={t('buttons.saveAriaLabel')}>
  Save Icon
</button>

TITLE TOOLTIPS:
<button title={t('buttons.deleteTooltip')}>
  Delete
</button>

ALT TEXT:
<img alt={t('common.logoAlt')} src="..." />

ARIA-DESCRIBEDBY:
<input aria-describedby="help-text" />
<p id="help-text">{t('form.emailHelp')}</p>

PLACEHOLDER (also accessibility-related):
<input placeholder={t('auth.emailPlaceholder')} />

IMPORTANT: Don't forget accessibility text!
Many users rely on screen readers and tooltips.


═══════════════════════════════════════════════════════════════════════════════
QUICK REFERENCE CHEAT SHEET
═══════════════════════════════════════════════════════════════════════════════

MOST COMMON USAGE:

import { t, formatDate, i18n } from '$lib/features/localization';

1. TRANSLATE TEXT:
   {t('auth.email')}

2. TRANSLATE BUTTON:
   <button>{t('common.save')}</button>

3. TRANSLATE LABEL + PLACEHOLDER:
   <label>{t('auth.emailLabel')}</label>
   <input placeholder={t('auth.emailPlaceholder')} />

4. TRANSLATE IN LOGIC:
   notifications.error(t('orders.saveError'));

5. FORMAT DATE:
   {formatDate(createdAt)}

6. SWITCH LANGUAGE:
   <button onclick={() => i18n.setLanguage('en')}>English</button>

7. CHECK CURRENT LANGUAGE:
   {#if i18n.getLanguage() === 'da'} ... {/if}

8. FORMAT DATE RELATIVE:
   {formatDateRelative(orderDate)}

9. ACCESSIBILITY:
   <button aria-label={t('buttons.closeAriaLabel')}>×</button>

10. VALIDATION MESSAGE:
    {#if !email} {t('validation.required')} {/if}


═══════════════════════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════════════════════

The i18n system in GoPayShortcuts is a complete, production-ready
internationalization solution supporting Danish and English.

KEY FEATURES:
✓ Browser language auto-detection
✓ Manual language switching
✓ localStorage persistence
✓ Locale-aware date formatting
✓ Type-safe translation keys
✓ Fallback mechanism (Danish is default)
✓ Real-time updates without page reload
✓ Full accessibility support

TO USE IN COMPONENTS:
1. Import t() and/or formatDate()
2. Replace hardcoded strings with t('key')
3. Add new translation keys to both languages
4. Test in both Danish and English

TO ADD NEW FEATURES:
1. Add translation keys to translations.ts
2. Use t('key') in components
3. Test language switching
4. That's it!

FOR MORE HELP:
→ See QuickStartGuide.ts for step-by-step integration
→ See COMPONENT_INTEGRATION_EXAMPLES.ts for real code patterns
→ Check translations.ts for available keys
→ Review this README for architecture and APIs
`;

/**
 * Export the README as a constant for documentation and reference
 */
export default LOCALIZATION_README;
