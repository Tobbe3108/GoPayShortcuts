/**
 * i18n System Quick Start Guide
 *
 * Comprehensive reference for implementing multi-language support in GoPayShortcuts.
 * This guide is organized by practical use cases with copy-paste ready examples.
 *
 * @see index.ts - Main i18n exports
 * @see i18nStore.ts - Store implementation
 * @see translations.ts - Translation keys and strings
 * @see dateFormatter.ts - Date formatting utilities
 */

export const QUICK_START_GUIDE = `
# i18n System - Quick Start Guide

## TABLE OF CONTENTS
1. Quick Start (5 minutes)
2. Step-by-Step Integration Plan
3. Common Patterns
4. Key Files Reference
5. Testing Checklist
6. Troubleshooting

---

## 1️⃣ QUICK START (5 MINUTES)

### Copy-Paste Example: Complete Setup

\`\`\`svelte
<!-- MyComponent.svelte -->
<script lang="ts">
  import { t, formatDate } from '$lib/features/localization';
  
  let selectedDate = new Date();
  let isLoading = false;
</script>

<h1>{t('orders.title')}</h1>
<p>Date: {formatDate(selectedDate)}</p>

<label for="email">{t('auth.emailLabel')}</label>
<input
  id="email"
  type="email"
  placeholder={t('auth.emailPlaceholder')}
/>

<button disabled={isLoading}>
  {#if isLoading}
    {t('auth.sending')}...
  {:else}
    {t('auth.continue')}
  {/if}
</button>
\`\`\`

### How to Use t() in a Component

**Step 1: Import the function**
\`\`\`typescript
import { t } from '$lib/features/localization';
\`\`\`

**Step 2: Use in templates**
\`\`\`svelte
<!-- Simple text -->
<h1>{t('orders.title')}</h1>

<!-- In attributes -->
<input placeholder={t('auth.emailPlaceholder')} />

<!-- In conditionals -->
{#if isLoading}
  <p>{t('auth.sending')}</p>
{:else}
  <p>{t('auth.continue')}</p>
{/if}

<!-- In event handlers -->
<button onclick={() => console.log(t('common.success'))}>
  {t('common.save')}
</button>
\`\`\`

**Step 3: Use in component logic**
\`\`\`typescript
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
\`\`\`

### How to Use formatDate()

\`\`\`typescript
import { formatDate, formatDateTime, formatTime, formatDateRelative } from '$lib/features/localization';

const date = new Date();

// Format date only (respects current language)
formatDate(date)                    // "15. Jan 2024" (Danish) or "Jan 15, 2024" (English)

// Format date and time together
formatDateTime(date)                // "15. Jan 2024 14:30" (Danish) or "Jan 15, 2024 14:30" (English)

// Format time only
formatTime(date)                    // "14:30"

// Smart relative formatting
formatDateRelative(date)            // "I dag" (Danish) or "Today" (English)
\`\`\`

### How to Add Language Switcher

\`\`\`svelte
<!-- LanguageSwitcher.svelte -->
<script lang="ts">
  import { i18n, type Language } from '$lib/features/localization';
  import Button from '$lib/components/atoms/Button.svelte';

  let currentLanguage = $derived(i18n.getLanguage());

  function switchLanguage(lang: Language) {
    i18n.setLanguage(lang);
  }
</script>

<div class="flex gap-2">
  <Button
    variant={currentLanguage === 'da' ? 'primary' : 'secondary'}
    onclick={() => switchLanguage('da')}
  >
    Dansk
  </Button>
  <Button
    variant={currentLanguage === 'en' ? 'primary' : 'secondary'}
    onclick={() => switchLanguage('en')}
  >
    English
  </Button>
</div>
\`\`\`

---

## 2️⃣ STEP-BY-STEP INTEGRATION PLAN

### Phase 1: Main Layout (1 component, ~5 min)
Update the main layout to add language switcher and localize header elements.

**File:** \`frontend/src/routes/+layout.svelte\`
**Changes:**
- Add language switcher to header
- Localize navbar labels
- Add logo alt text

**Time estimate:** 5 minutes

\`\`\`svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
</script>

<nav>
  <a href="/">{t('menu.home')}</a>
  <a href="/orders">{t('menu.orders')}</a>
  <a href="/products">{t('menu.products')}</a>
  <LanguageSwitcher />
</nav>

<main>{@render children?.()}</main>
\`\`\`

### Phase 2: Authentication Pages (3 components, ~15 min)
Update login, email verification, and code verification pages.

**Files:**
- \`frontend/src/routes/login/+page.svelte\`
- \`frontend/src/lib/features/auth/pages/EmailStep.svelte\`
- \`frontend/src/lib/features/auth/pages/CodeStep.svelte\`

**Changes:**
- Replace all hardcoded strings with t()
- Update form labels, placeholders, buttons
- Localize error messages in try/catch blocks
- Update aria-labels for accessibility

**Time estimate:** 15 minutes

### Phase 3: Orders Feature (5 components, ~30 min)
Update orders list, order cards, and order details.

**Files:**
- \`frontend/src/routes/orders/+page.svelte\`
- \`frontend/src/lib/features/orders/organisms/OrderCard.svelte\`
- \`frontend/src/lib/features/orders/templates/DayViewTemplate.svelte\`
- \`frontend/src/lib/features/orders/molecules/OrderForm.svelte\`
- \`frontend/src/lib/features/orders/atoms/OrderHeader.svelte\`

**Changes:**
- Replace all column headers and labels
- Localize status messages
- Update notification messages
- Add formatDate() for order dates
- Update validation messages

**Time estimate:** 30 minutes

### Phase 4: Remaining Features (10+ components)
Update products, locations, settings, and other remaining components.

**Files:**
- Products: list, cards, forms
- Locations: list, cards, forms
- Settings: general, profile, preferences
- Common components: dialogs, modals, tables

**Changes:**
- Same pattern as previous phases
- Replace hardcoded strings
- Localize messages and notifications
- Update validation

**Time estimate:** Varies by scope (1-2 hours)

### Phase 5: Test and Verify (All components)
Test all functionality in both languages.

**Checklist:**
- ✓ Test Danish UI (all pages, components)
- ✓ Test English UI (all pages, components)
- ✓ Test language switching (persistence across pages)
- ✓ Test localStorage persistence
- ✓ Test browser language detection
- ✓ Test with different text lengths (German-like expansion)
- ✓ Run type-checking for missing keys

**Time estimate:** 30 minutes

---

## 3️⃣ COMMON PATTERNS

### Pattern 1: Labels & Placeholders

\`\`\`svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
</script>

<!-- Form labels -->
<label for="email">{t('auth.emailLabel')}</label>

<!-- Input placeholders -->
<input placeholder={t('auth.emailPlaceholder')} />

<!-- Button text -->
<button>{t('common.save')}</button>

<!-- Help text -->
<small>{t('form.emailHelpText')}</small>

<!-- Headings -->
<h1>{t('orders.title')}</h1>
<h2>{t('products.subtitle')}</h2>
\`\`\`

### Pattern 2: Error & Success Messages

\`\`\`typescript
import { t } from '$lib/features/localization';
import { notifications } from '$lib/core/notifications/notificationStore';

// Success notifications
notifications.success(t('orders.saveSuccess'));

// Error notifications
notifications.error(t('orders.saveError'));

// Info notifications
notifications.info(t('orders.note'));

// Confirmation dialogs
const confirmed = confirm(t('orders.confirmDelete'));

// Validation errors
const error = !email ? t('validation.required') : null;
\`\`\`

### Pattern 3: Buttons & Actions

\`\`\`svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
  import Button from '$lib/components/atoms/Button.svelte';
</script>

<!-- Action buttons -->
<Button onclick={handleSave}>
  {t('common.save')}
</Button>

<!-- Secondary buttons -->
<Button variant="secondary" onclick={handleCancel}>
  {t('common.cancel')}
</Button>

<!-- Loading state -->
<Button disabled={isLoading}>
  {#if isLoading}
    {t('common.loading')}
  {:else}
    {t('common.save')}
  {/if}
</Button>

<!-- Buttons with icons -->
<Button>
  {t('orders.create')}
  <ArrowRightIcon />
</Button>
\`\`\`

### Pattern 4: Accessibility

\`\`\`svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
</script>

<!-- aria-label for icon-only buttons -->
<button aria-label={t('buttons.closeAriaLabel')}>
  <XIcon />
</button>

<!-- aria-describedby for help text -->
<input
  aria-label={t('auth.emailLabel')}
  aria-describedby="email-help"
/>
<p id="email-help">{t('form.emailHelpText')}</p>

<!-- title attributes for tooltips -->
<button title={t('buttons.deleteTooltip')}>
  {t('common.delete')}
</button>

<!-- role and aria-live for announcements -->
<div role="status" aria-live="polite">
  {t('orders.savingOrder')}
</div>
\`\`\`

### Pattern 5: Dynamic Content with Conditions

\`\`\`svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
  
  let orderStatus = 'pending';
</script>

<!-- Conditional messages -->
{#if isPast(date)}
  <p>{t('orders.pastDateMessage')}</p>
{:else if isToday(date)}
  <p>{t('orders.todayMessage')}</p>
{:else}
  <p>{t('orders.futureMessage')}</p>
{/if}

<!-- Conditional button text -->
<button>
  {#if isLoading}
    {t('auth.sending')}...
  {:else}
    {t('auth.continue')}
  {/if}
</button>

<!-- List headers -->
<table>
  <thead>
    <tr>
      <th>{t('orders.orderNumber')}</th>
      <th>{t('orders.date')}</th>
      <th>{t('orders.total')}</th>
      <th>{t('orders.status')}</th>
    </tr>
  </thead>
</table>

<!-- Empty states -->
{#if orders.length === 0}
  <p>{t('orders.noOrders')}</p>
  <p class="text-gray-500">{t('orders.empty')}</p>
{/if}
\`\`\`

---

## 4️⃣ KEY FILES REFERENCE

### File Structure
\`\`\`
frontend/src/lib/features/localization/
├── index.ts                          # Main exports
├── i18nStore.ts                      # Language store and t() function
├── translations.ts                   # All translation strings (da & en)
├── dateFormatter.ts                  # Date formatting utilities
├── COMPONENT_INTEGRATION_EXAMPLES.ts # Detailed before/after examples
└── QuickStartGuide.ts                # This file
\`\`\`

### What Each File Does

**index.ts** - Re-exports main functions and types
- Imports: None needed, use this for exports
- Exports: t(), i18n, formatDate(), Language type
- Purpose: Single import point for all i18n functionality

**i18nStore.ts** - Language store and translation engine
- Provides: i18n store, t() function, language detection
- Handles: Language persistence, fallback to Danish
- Auto-detects: Browser language on first visit
- Persists: Language choice to localStorage

**translations.ts** - All translation strings
- Structure: Organized by feature (auth, orders, products, etc.)
- Languages: Danish (da) and English (en)
- Keys: Use dot notation (e.g., 'auth.emailLabel')
- Add new strings: Always add to BOTH da and en sections

**dateFormatter.ts** - Locale-aware date formatting
- Functions:
  - formatDate() - Date only
  - formatDateTime() - Date and time
  - formatTime() - Time only
  - formatDateRelative() - Smart "Today", "Yesterday", etc.
  - formatDuration() - Human readable duration
  - getWeekNumber() - Week number calculation
  - isFuture() / isPast() - Date comparison

**COMPONENT_INTEGRATION_EXAMPLES.ts** - Detailed examples
- Before/after code examples
- Real component patterns
- Common mistakes to avoid
- Advanced patterns for complex scenarios

### Import Statements Needed

**Simple case - just use t():**
\`\`\`typescript
import { t } from '$lib/features/localization';
\`\`\`

**Also need date formatting:**
\`\`\`typescript
import { t, formatDate, formatDateTime } from '$lib/features/localization';
\`\`\`

**Need language switching:**
\`\`\`typescript
import { t, i18n, type Language } from '$lib/features/localization';
\`\`\`

**Advanced - store subscription:**
\`\`\`typescript
import { i18n } from '$lib/features/localization';

let currentLang = $derived(i18n.getLanguage());
\`\`\`

---

## 5️⃣ TESTING CHECKLIST

### Test Danish UI
- [ ] All pages render without missing translations
- [ ] All buttons have Danish labels
- [ ] All form fields have Danish placeholders
- [ ] All error messages appear in Danish
- [ ] Dates format correctly (dd. MMM yyyy)
- [ ] Time formats correctly (HH:mm)

### Test English UI
- [ ] All pages render without missing translations
- [ ] All buttons have English labels
- [ ] All form fields have English placeholders
- [ ] All error messages appear in English
- [ ] Dates format correctly (MMM dd, yyyy)
- [ ] Time formats correctly (HH:mm)

### Test Language Switching
- [ ] Clicking language switcher changes UI
- [ ] Language switches instantly (no page reload)
- [ ] All components update (not just one)
- [ ] Navigation labels update
- [ ] Error messages in correct language
- [ ] Dates reformat when language changes

### Test localStorage Persistence
- [ ] Close page, reopen → language preference persists
- [ ] Clear localStorage, reopen → defaults to browser language
- [ ] Switch language, close, reopen → same language
- [ ] Works in different browsers

### Test Browser Language Detection
- [ ] First visit with Danish browser → defaults to Danish
- [ ] First visit with English browser → defaults to English
- [ ] First visit with other language → defaults to Danish
- [ ] localStorage preference overrides browser language

### Automated Testing
\`\`\`typescript
// Example test
import { render } from '@testing-library/svelte';
import { i18n } from '$lib/features/localization';
import MyComponent from './MyComponent.svelte';

test('component shows Danish text', () => {
  i18n.setLanguage('da');
  const { getByText } = render(MyComponent);
  expect(getByText('Log ind')).toBeInTheDocument();
});

test('component shows English text', () => {
  i18n.setLanguage('en');
  const { getByText } = render(MyComponent);
  expect(getByText('Sign in')).toBeInTheDocument();
});
\`\`\`

---

## 6️⃣ TROUBLESHOOTING

### Issue: Missing Translation Keys
**Symptom:** UI shows 'auth.emailLabel' instead of actual text

**Solution:**
1. Check translations.ts has the key in BOTH da and en
2. Verify key spelling matches exactly (case-sensitive)
3. Restart dev server

\`\`\`typescript
// translations.ts - Add missing key
export const translations = {
  da: {
    auth: {
      emailLabel: 'Email',  // ✓ Add here
    }
  },
  en: {
    auth: {
      emailLabel: 'Email',  // ✓ AND here
    }
  }
};
\`\`\`

### Issue: Language Doesn't Update When Switching
**Symptom:** Click language switcher but UI stays in old language

**Cause:** t() called in script setup (not reactive)

**Solution:** Call t() in template, not in script
\`\`\`svelte
<!-- ✗ WRONG - stored in script -->
<script>
  const label = t('auth.emailLabel');  // Won't update
</script>
<label>{label}</label>

<!-- ✓ RIGHT - called in template -->
<script>
  import { t } from '$lib/features/localization';
</script>
<label>{t('auth.emailLabel')}</label>
\`\`\`

### Issue: Translations Not Showing on First Load
**Symptom:** Page loads with missing translations, then fills in

**Cause:** Server-side rendering misses client-side language detection

**Solution:** Default language is 'da' - if you need client detection:
\`\`\`svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { i18n } from '$lib/features/localization';
  
  if (browser) {
    // Force language detection on client
    const saved = localStorage.getItem('language-preference');
    if (!saved) {
      const browserLang = navigator.language;
      if (browserLang.startsWith('en')) {
        i18n.setLanguage('en');
      }
    }
  }
</script>
\`\`\`

### Issue: Date Formatting Wrong Language
**Symptom:** Dates show English format even though UI is Danish

**Cause:** formatDate() not passed explicitly or store not updated

**Solution:**
\`\`\`typescript
// ✓ Correct - uses current language automatically
formatDate(new Date())

// ✓ Also correct - explicit language
formatDate(new Date(), undefined, 'da')

// If needed to debug
console.log(i18n.getLanguage());  // Check current language
\`\`\`

### Issue: Validation Messages Not Translating
**Symptom:** Validation error shows hardcoded string

**Solution:** Use t() in validation functions
\`\`\`typescript
// ✗ WRONG - hardcoded
function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  return null;
}

// ✓ RIGHT - translated
import { t } from '$lib/features/localization';

function validateEmail(email: string): string | null {
  if (!email) return t('validation.required');
  return null;
}
\`\`\`

### Issue: Performance Slow After Adding i18n
**Symptom:** Page renders slower than before

**Note:** This is extremely unlikely - t() is just a fast object lookup.

**Diagnosis:**
1. t() overhead is negligible (microseconds)
2. Check if you're calling t() in a loop unnecessarily
3. Check if store subscription is causing extra renders

**Solution:**
\`\`\`svelte
<!-- ✗ Slow - recalculates every render -->
{#each items as item}
  <p>{t('common.item')} {item.name}</p>
{/each}

<!-- ✓ Fast - still the same, t() is cached -->
<!-- (This is actually the same performance) -->
\`\`\`

---

## QUICK REFERENCE CHEAT SHEET

### Most Common Use Cases

\`\`\`svelte
<!-- 1. Simple text -->
<button>{t('common.save')}</button>

<!-- 2. Form label -->
<label for="email">{t('auth.emailLabel')}</label>

<!-- 3. Placeholder -->
<input placeholder={t('auth.emailPlaceholder')} />

<!-- 4. Error message -->
<span>{t('validation.required')}</span>

<!-- 5. Date formatting -->
<p>{formatDate(createdAt)}</p>

<!-- 6. Conditional text -->
{#if isLoading}
  {t('common.loading')}
{:else}
  {t('common.done')}
{/if}

<!-- 7. Accessibility -->
<button aria-label={t('buttons.deleteAriaLabel')}>
  Delete
</button>

<!-- 8. Notification -->
notifications.success(t('orders.saveSuccess'));

<!-- 9. Language switcher -->
<button onclick={() => i18n.setLanguage('en')}>
  English
</button>

<!-- 10. Check current language -->
{#if i18n.getLanguage() === 'da'}
  Danish content
{:else}
  English content
{/if}
\`\`\`

---

## KEY PRINCIPLES

1. **Always use t() for user-facing text** - Don't hardcode strings
2. **Add to BOTH languages** - Always add new keys to 'da' AND 'en'
3. **Call t() fresh in templates** - Don't store results in variables
4. **Use dot notation for keys** - 'feature.description' not 'feature description'
5. **Keep aria-labels translated** - Don't forget accessibility
6. **Test in both languages** - Always verify both work
7. **Format dates with formatDate()** - Use utilities, not hardcoded formats
8. **Reuse keys across components** - Don't create unique keys for same text

---

## NEXT STEPS

1. ✓ Read this guide (you're doing it!)
2. → Start with Phase 1: Update main layout
3. → Add language switcher (5 min)
4. → Continue with Phase 2-5 as time allows
5. → Run tests in both languages
6. → Push changes to git

---

## GETTING HELP

1. Check COMPONENT_INTEGRATION_EXAMPLES.ts for detailed before/after
2. Look at existing components using i18n (auth features)
3. Review translations.ts for available keys
4. Check browser console for errors or missing keys
5. Run \`npm run dev\` to verify changes locally

Good luck! You've got this! 🚀
`;
