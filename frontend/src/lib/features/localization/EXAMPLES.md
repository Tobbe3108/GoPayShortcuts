/**
 * QUICK START GUIDE - Localization System Examples
 * 
 * This file demonstrates how to use the localization system in your components.
 * These are example patterns - not meant to be executed.
 */

// ============================================================================
// EXAMPLE 1: Basic Translation in a Svelte Component
// ============================================================================

/**
 * Use the t() function for simple translations
 * 
 * In: frontend/src/routes/login/+page.svelte
 */
const basicExample = `
<script lang="ts">
  import { t } from '$lib/features/localization';
  import LoginForm from '$lib/features/auth/organisms/LoginForm.svelte';
</script>

<div class="login-container">
  <h1>{t('auth.login')}</h1>
  <LoginForm />
</div>
`;

// ============================================================================
// EXAMPLE 2: Language Switcher Component
// ============================================================================

/**
 * Create a language switcher that changes the app language
 * 
 * In: frontend/src/lib/components/organisms/LanguageSwitcher.svelte
 */
const languageSwitcher = `
<script lang="ts">
  import { i18n } from '$lib/features/localization';
  import type { Language } from '$lib/features/localization';
  
  const languages: { code: Language; label: string }[] = [
    { code: 'da', label: 'Dansk' },
    { code: 'en', label: 'English' },
  ];

  let currentLang = $state(i18n.getLanguage());

  function handleLanguageChange(lang: Language) {
    currentLang = lang;
    i18n.setLanguage(lang);
    // Language is now persisted to localStorage automatically
  }
</script>

<select {currentLang} onchange={(e) => handleLanguageChange(e.target.value)}>
  {#each languages as lang}
    <option value={lang.code}>{lang.label}</option>
  {/each}
</select>

<style>
  select {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--color-border);
  }
</style>
`;

// ============================================================================
// EXAMPLE 3: Extracting String from AuthForm Component
// ============================================================================

/**
 * Convert hardcoded strings to use translations
 * 
 * BEFORE: In frontend/src/lib/features/auth/organisms/AuthForm.svelte
 */
const authFormBefore = `
<FormField
  id="email"
  label="Email adresse"                    // ❌ Hardcoded
  type="email"
  placeholder="Indtast din email"          // ❌ Hardcoded
  bind:value={email}
/>

<Button type="submit" disabled={isLoading}>
  {#if isLoading}
    <span>Sender...</span>                 {/* ❌ Hardcoded */}
  {:else}
    Fortsæt                                {/* ❌ Hardcoded */}
  {/if}
</Button>
`;

/**
 * AFTER: Using localization
 */
const authFormAfter = `
<script lang="ts">
  import { t } from '$lib/features/localization';
</script>

<FormField
  id="email"
  label={t('auth.email')}                  // ✓ Localized
  type="email"
  placeholder={t('auth.emailPlaceholder')} // ✓ Localized
  bind:value={email}
/>

<Button type="submit" disabled={isLoading}>
  {#if isLoading}
    <span>{t('auth.sending')}</span>       {/* ✓ Localized */}
  {:else}
    {t('auth.continue')}                   {/* ✓ Localized */}
  {/if}
</Button>
`;

// ============================================================================
// EXAMPLE 4: Using Date Formatting
// ============================================================================

/**
 * Format dates respecting the current language
 * 
 * In: frontend/src/lib/features/orders/organisms/OrderList.svelte
 */
const orderListExample = `
<script lang="ts">
  import { t, formatDate, formatDateTime } from '$lib/features/localization';
  import { ordersStore } from '$lib/features/orders/store';
  
  interface Order {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    total: number;
  }
  
  let orders: Order[] = [];
  
  onMount(async () => {
    orders = await ordersStore.getOrders();
  });
</script>

<div class="orders-container">
  <h1>{t('orders.title')}</h1>
  
  {#if orders.length === 0}
    <p>{t('orders.empty')}</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>{t('orders.orderNumber')}</th>
          <th>{t('orders.date')}</th>
          <th>{t('orders.total')}</th>
        </tr>
      </thead>
      <tbody>
        {#each orders as order}
          <tr>
            <td>{order.id}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>{order.total} kr</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
`;

// ============================================================================
// EXAMPLE 5: Form Validation Messages
// ============================================================================

/**
 * Use localized validation messages
 * 
 * In: frontend/src/lib/features/auth/organisms/AuthForm.svelte
 */
const validationExample = `
<script lang="ts">
  import { t } from '$lib/features/localization';
  
  function validateEmail(email: string): string | null {
    if (!email) {
      return t('validation.required');
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return t('validation.email');
    }
    return null;
  }
  
  let emailError = $state<string | null>(null);
  
  function handleEmailChange(value: string) {
    emailError = validateEmail(value);
  }
</script>

<FormField
  id="email"
  label={t('auth.email')}
  type="email"
  placeholder={t('auth.emailPlaceholder')}
  bind:value={email}
  onchange={handleEmailChange}
  error={emailError}
/>

{#if emailError}
  <span class="error">{emailError}</span>
{/if}
`;

// ============================================================================
// EXAMPLE 6: Reactive Language Updates
// ============================================================================

/**
 * Component that reacts to language changes
 * 
 * In: frontend/src/lib/components/templates/PageHeader.svelte
 */
const reactiveLanguageExample = `
<script lang="ts">
  import { i18n, t } from '$lib/features/localization';
  
  let currentLang = $state(i18n.getLanguage());
  let pageTitle = $state(t('common.home'));
  
  // Subscribe to language changes
  $effect(() => {
    const unsubscribe = i18n.subscribe((state) => {
      currentLang = state.currentLanguage;
      // Re-fetch translation whenever language changes
      pageTitle = t('common.home');
    });
    
    return () => {
      unsubscribe?.();
    };
  });
</script>

<header>
  <h1>{pageTitle}</h1>
  <p>{t('common.loading')}</p>
</header>
`;

// ============================================================================
// EXAMPLE 7: Server-Side Language Detection
// ============================================================================

/**
 * Use language detection in server-side routes
 * 
 * In: frontend/src/routes/+layout.server.ts
 */
const serverSideExample = `
import type { LayoutServerLoad } from './$types';
import { getSupportedLanguage } from '$lib/features/localization';

export const load: LayoutServerLoad = async ({ request }) => {
  // Get user's preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const userLanguage = getSupportedLanguage(acceptLanguage);
  
  return {
    userLanguage,
  };
};
`;

// ============================================================================
// EXAMPLE 8: Adding New Translations
// ============================================================================

/**
 * When adding a new feature, add translations to translations.ts
 * 
 * In: frontend/src/lib/features/localization/translations.ts
 */
const newTranslationsExample = `
export const translations = {
  da: {
    // ...existing translations...
    
    // NEW: Reports feature
    reports: {
      title: 'Rapporter',
      generateReport: 'Generér rapport',
      dateRange: 'Datointerval',
      export: 'Eksporter',
      noReports: 'Ingen rapporter',
      reportGenerated: 'Rapport blev genereret',
    },
  },
  en: {
    // ...existing translations...
    
    // NEW: Reports feature
    reports: {
      title: 'Reports',
      generateReport: 'Generate report',
      dateRange: 'Date range',
      export: 'Export',
      noReports: 'No reports',
      reportGenerated: 'Report was generated',
    },
  },
};
`;

// ============================================================================
// EXAMPLE 9: Complex Date Formatting
// ============================================================================

/**
 * Advanced date formatting examples
 * 
 * In: frontend/src/lib/features/orders/molecules/OrderTimestamps.svelte
 */
const complexDateExample = `
<script lang="ts">
  import {
    formatDate,
    formatDateTime,
    formatDateRelative,
    formatRelativeTime,
    t,
  } from '$lib/features/localization';
  
  interface Props {
    createdAt: Date;
    updatedAt: Date;
  }
  
  let { createdAt, updatedAt }: Props = $props();
</script>

<div class="timestamps">
  <div>
    <label>{t('orders.createdAt')}:</label>
    <span>{formatDateTime(createdAt)}</span>
    <small>{formatRelativeTime(createdAt)}</small>
  </div>
  
  <div>
    <label>{t('orders.updatedAt')}:</label>
    <span>{formatDate(updatedAt)}</span>
    <small>{formatDateRelative(updatedAt)}</small>
  </div>
</div>

<style>
  .timestamps {
    display: flex;
    gap: 2rem;
  }
  
  div {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-weight: 600;
    color: var(--color-text-secondary);
  }
  
  small {
    color: var(--color-text-tertiary);
    font-size: 0.875rem;
  }
</style>
`;

// ============================================================================
// EXAMPLE 10: Notification Messages
// ============================================================================

/**
 * Use localized messages for notifications
 * 
 * In: frontend/src/routes/login/+page.svelte
 */
const notificationExample = `
<script lang="ts">
  import { authStore } from '$lib/features/auth/store';
  import { notifications } from '$lib/core/notifications/notificationStore';
  import { t } from '$lib/features/localization';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  
  async function handleEmailSubmit(email: string) {
    if (!email) {
      // Use localized validation message
      notifications.error(t('validation.required'));
      return;
    }
    
    try {
      await authStore.requestOTP(email);
      notifications.info(t('auth.verificationCode'));
    } catch (err) {
      // Use localized error message
      notifications.error(t('auth.emailRequired'));
    }
  }
  
  async function handleLogin(otp: string) {
    try {
      await authStore.login(otp);
      // Use localized success message
      notifications.success(t('auth.loginSuccess'));
      goto(base || '/');
    } catch (err) {
      // Use localized error message
      notifications.error(t('auth.loginFailed'));
    }
  }
</script>
`;

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/**
 * CHECKLIST: Converting a Component to Use Localization
 * 
 * 1. ☐ Import { t } from '$lib/features/localization'
 * 2. ☐ Identify all hardcoded strings
 * 3. ☐ Check if translation keys exist in translations.ts
 * 4. ☐ If not, add them to translations.da and translations.en
 * 5. ☐ Replace hardcoded strings with t('key.subkey')
 * 6. ☐ Test in both Danish and English
 * 7. ☐ Verify localStorage is persisting language choice
 */

/**
 * ADDING A NEW FEATURE'S TRANSLATIONS
 * 
 * 1. In translations.ts, add new top-level feature key
 * 2. Add all strings for feature in both 'da' and 'en'
 * 3. Keep strings organized and named clearly
 * 4. Use consistent naming (not mixing 'label', 'title', 'name')
 * 5. Run npm run check to verify TypeScript
 * 6. Update components to use new translation keys
 */
