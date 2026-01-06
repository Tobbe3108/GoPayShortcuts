/**
 * I18n Usage Examples
 * 
 * This file demonstrates how to use the i18n (internationalization) system
 * in GoPayShortcuts components and pages.
 * 
 * SETUP:
 * The i18n system is already initialized in +layout.ts and +layout.svelte
 * which automatically detects browser language and sets the initial locale.
 * 
 * USAGE:
 * 
 * 1. In Component Script:
 *    =====================
 * 
 *    import { locale, translations, t } from '$lib/i18n';
 *    
 *    // Read current locale
 *    let currentLocale = $locale;  // 'da' or 'en'
 *    
 *    // Get translations object (all translations for current locale)
 *    let allTranslations = $translations;  // { auth: { ... }, navigation: { ... } }
 *    
 *    // Get specific translation using helper function
 *    let emailLabel = t('auth.emailLabel');
 *    let emailPlaceholder = t('auth.emailPlaceholder');
 *    let continueButtonText = t('navigation.nextDay');
 *    
 *    // Use default value if key not found (optional)
 *    let fallback = t('missing.key', 'Default text');
 * 
 * 
 * 2. In Template:
 *    =============
 * 
 *    <input placeholder={t('auth.emailPlaceholder')} />
 *    <button>{t('auth.continueButton')}</button>
 *    <label>{t('navigation.logout')}</label>
 *    
 *    <!-- Reactive updates when locale changes -->
 *    <p>{t('auth.emailLabel')}: {email}</p>
 *    
 * 
 * 3. Changing Locale:
 *    =================
 * 
 *    import { locale } from '$lib/i18n';
 *    
 *    // Change to English
 *    locale.set('en');
 *    
 *    // Change to Danish
 *    locale.set('da');
 *    
 *    // All components automatically re-render with new translations
 * 
 * 
 * TRANSLATION FILES:
 * ==================
 * 
 * Location: frontend/src/lib/i18n/locales/
 * 
 * Supported locales:
 * - da.json (Danish) - DEFAULT
 * - en.json (English)
 * 
 * Structure (nested dot-separated keys):
 * {
 *   "auth": {
 *     "emailLabel": "Email adresse",
 *     "emailPlaceholder": "Indtast din email",
 *     "continueButton": "Fortsæt"
 *   },
 *   "navigation": {
 *     "logout": "Log ud",
 *     ...
 *   }
 * }
 * 
 * Access with dot notation: t('auth.emailLabel')
 * 
 * 
 * ADDING NEW TRANSLATIONS:
 * =======================
 * 
 * 1. Add the key/value pair to both da.json and en.json:
 * 
 *    // da.json
 *    {
 *      "myFeature": {
 *        "title": "Min Titel"
 *      }
 *    }
 *    
 *    // en.json
 *    {
 *      "myFeature": {
 *        "title": "My Title"
 *      }
 *    }
 * 
 * 2. Use in component:
 * 
 *    import { t } from '$lib/i18n';
 *    
 *    <h1>{t('myFeature.title')}</h1>
 * 
 * 
 * BROWSER LANGUAGE DETECTION:
 * ============================
 * 
 * On first load, the app automatically detects the browser language:
 * - If navigator.language starts with 'da' → locale set to 'da'
 * - If navigator.language starts with 'en' → locale set to 'en'
 * - Otherwise → defaults to 'da' (Danish)
 * 
 * User can override at any time by calling: locale.set('en')
 * 
 * 
 * STORE SUBSCRIPTIONS:
 * ====================
 * 
 * If you need to react to locale changes with custom logic:
 * 
 *    import { locale } from '$lib/i18n';
 *    
 *    locale.subscribe((currentLocale) => {
 *      console.log('Locale changed to:', currentLocale);
 *      // Perform custom action
 *    });
 * 
 * 
 * REACTIVITY IN SVELTE 5:
 * =======================
 * 
 * Use $derived to create derived values from translations:
 * 
 *    import { t } from '$lib/i18n';
 *    
 *    let emailLabel = $derived(t('auth.emailLabel'));
 *    
 *    // This will automatically update when locale changes
 * 
 * 
 * TYPE SAFETY:
 * ============
 * 
 * Locale type is exported from i18n module:
 * 
 *    import type { Locale } from '$lib/i18n';
 *    
 *    function setLanguage(lang: Locale) {
 *      // lang is type-safe, can only be 'da' or 'en'
 *    }
 * 
 */

// This file is for documentation only - not executed
