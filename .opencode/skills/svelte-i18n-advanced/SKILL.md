---
name: svelte-i18n-advanced
description: Implement multi-language support in Svelte apps using svelte-i18n with dynamic locale switching, namespace organization, and production patterns for SvelteKit
license: MIT
compatibility: opencode
metadata:
  audience: developers, frontend-engineers
  domain: internationalization
  workflow: feature-development
  updated: "2025-01"
  keywords: svelte, i18n, translations, localization, svelte-i18n, sveltekit
---

## What I do

I guide you through advanced internationalization (i18n) patterns for Svelte applications using svelte-i18n. I help you:

- **Set up svelte-i18n** - Configure the library with locale detection, fallback chains, and production-ready settings
- **Organize translations** - Structure translation files and namespaces for scalability and team collaboration
- **Integrate with components** - Use the `$t()` function and reactive translations in Svelte components
- **Implement dynamic locale switching** - Allow users to change language at runtime with persistent preferences
- **Handle advanced features** - Apply pluralization rules, interpolation, nested translations, and formatting (dates, numbers, currency)
- **Optimize performance** - Lazy-load translations, code-split by locale, and cache efficiently
- **Handle SvelteKit specifics** - Navigate server/client boundaries, SSR considerations, and universal stores

## When to use me

Load this skill when:

- You're adding multi-language support to a Svelte or SvelteKit application
- You need to set up and configure svelte-i18n from scratch
- You're organizing translation files and namespaces for a growing team
- You're implementing dynamic locale switching with persistent user preferences
- You need to handle pluralization, interpolation, or complex formatting in translations
- You're optimizing i18n performance for production (lazy loading, code splitting)
- You're working with SvelteKit and need to understand server/client i18n patterns
- You're migrating from another i18n solution to svelte-i18n

## Installation and setup

### Basic installation

```bash
npm install svelte-i18n
# or
pnpm add svelte-i18n
# or
bun add svelte-i18n
```

### Initialize svelte-i18n in your app

**File: `src/lib/i18n.ts` (Svelte or SvelteKit)**

```typescript
import { init, getLocaleFromNavigator } from 'svelte-i18n';

export function initializeI18n() {
  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(), // Auto-detect browser language
    formats: {
      // Optional: define custom date/number formats
      number: {
        EUR: { style: 'currency', currency: 'EUR' },
        USD: { style: 'currency', currency: 'USD' },
      },
      date: {
        short: { month: 'numeric', day: 'numeric', year: '2-digit' },
        long: { month: 'long', day: 'numeric', year: 'numeric' },
      },
    },
    messages: {
      en: { /* translations */ },
      es: { /* translations */ },
      fr: { /* translations */ },
    },
  });
}

export { getLocaleFromNavigator };
```

### Load translations from JSON files (recommended)

Instead of inline messages, load from separate files for better maintainability:

**File: `src/locales/en.json`**

```json
{
  "header.welcome": "Welcome",
  "header.language": "Language",
  "button.submit": "Submit",
  "errors.required": "This field is required",
  "common.loading": "Loading..."
}
```

**File: `src/lib/i18n.ts` (with external files)**

```typescript
import { init, getLocaleFromNavigator } from 'svelte-i18n';

// Dynamic locale loader
async function loadLocaleMessages(locale: string) {
  try {
    return await import(`../locales/${locale}.json`);
  } catch (err) {
    console.warn(`Locale ${locale} not found, falling back to English`);
    return await import('../locales/en.json');
  }
}

export async function initializeI18n() {
  const initialLocale = getLocaleFromNavigator() || 'en';

  init({
    fallbackLocale: 'en',
    initialLocale,
    messages: {
      en: (await loadLocaleMessages('en')).default,
      es: (await loadLocaleMessages('es')).default,
      fr: (await loadLocaleMessages('fr')).default,
    },
  });
}
```

## Translation file organization

### Flat structure (small projects)

```
src/locales/
├── en.json
├── es.json
├── fr.json
└── de.json
```

**File: `src/locales/en.json`**

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.contact": "Contact",
  "page.home.title": "Welcome to our site",
  "page.about.title": "About us",
  "common.loading": "Loading...",
  "common.error": "An error occurred"
}
```

**Pros**: Simple, easy to navigate
**Cons**: Doesn't scale well with many keys

### Namespace structure (medium to large projects)

```
src/locales/
├── en/
│   ├── common.json
│   ├── header.json
│   ├── footer.json
│   └── pages/
│       ├── home.json
│       ├── about.json
│       └── contact.json
├── es/
│   ├── common.json
│   ├── header.json
│   └── pages/
│       └── ...
└── fr/
    └── ...
```

**File: `src/locales/en/common.json`**

```json
{
  "loading": "Loading...",
  "error": "An error occurred",
  "success": "Success!",
  "cancel": "Cancel"
}
```

**File: `src/locales/en/header.json`**

```json
{
  "home": "Home",
  "about": "About",
  "contact": "Contact",
  "language": "Language"
}
```

**Pros**: Organized by feature/domain, scales well
**Cons**: Requires namespace setup in svelte-i18n

### Namespace loader (recommended pattern)

**File: `src/lib/i18n.ts`**

```typescript
import { init, getLocaleFromNavigator } from 'svelte-i18n';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de'];

async function loadLocaleNamespace(locale: string, namespace: string) {
  try {
    return (await import(`../locales/${locale}/${namespace}.json`)).default;
  } catch (err) {
    console.warn(`Locale ${locale}/${namespace} not found`);
    return {};
  }
}

async function loadAllNamespaces(locale: string) {
  const namespaces = ['common', 'header', 'footer', 'pages/home', 'pages/about'];
  const messages: Record<string, any> = {};

  for (const ns of namespaces) {
    messages[ns] = await loadLocaleNamespace(locale, ns);
  }

  return messages;
}

export async function initializeI18n() {
  const initialLocale = getLocaleFromNavigator() || 'en';
  const messages: Record<string, Record<string, any>> = {};

  for (const locale of SUPPORTED_LOCALES) {
    messages[locale] = await loadAllNamespaces(locale);
  }

  init({
    fallbackLocale: 'en',
    initialLocale,
    messages,
  });
}
```

## Component integration with $t() function

### Using translations in components

**File: `src/routes/+page.svelte`**

```svelte
<script>
  import { _, locale } from 'svelte-i18n';
</script>

<div class="container">
  <h1>{$_('page.home.title')}</h1>
  <p>{$_('page.home.description')}</p>
  <button>{$_('button.submit')}</button>

  <p>Current locale: {$locale}</p>
</div>
```

### Using the `_()` function with fallback

```svelte
<script>
  import { _, locale } from 'svelte-i18n';
</script>

<div>
  <!-- Fallback to default text if translation key not found -->
  <h1>{$_('title.missing', { default: 'Default Title' })}</h1>
</div>
```

### Accessing translations in JavaScript

```typescript
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

function showAlert() {
  const t = get(_);
  const message = t('dialog.confirmDelete');
  alert(message);
}
```

## Dynamic locale switching

### Store-based locale management

**File: `src/lib/stores/locale.ts`**

```typescript
import { writable } from 'svelte/store';
import { locale as i18nLocale } from 'svelte-i18n';

// Persist user's locale preference to localStorage
export function createLocaleStore() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
  const initial = stored || 'en';

  const { subscribe, set } = writable<string>(initial);

  return {
    subscribe,
    setLocale: (newLocale: string) => {
      set(newLocale);
      i18nLocale.set(newLocale); // Update svelte-i18n
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale); // Persist preference
      }
    },
  };
}

export const userLocale = createLocaleStore();
```

### Locale switcher component

**File: `src/components/LocaleSwitcher.svelte`**

```svelte
<script>
  import { locale, locales } from 'svelte-i18n';
  import { userLocale } from '$lib/stores/locale';

  function handleLocaleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    userLocale.setLocale(target.value);
  }
</script>

<div class="locale-switcher">
  <label for="language-select">Language:</label>
  <select id="language-select" value={$locale} on:change={handleLocaleChange}>
    <option value="en">English</option>
    <option value="es">Español</option>
    <option value="fr">Français</option>
    <option value="de">Deutsch</option>
  </select>
</div>

<style>
  .locale-switcher {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  label {
    font-weight: 500;
  }

  select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
```

### Update HTML lang attribute

For accessibility and SEO, update the document's `lang` attribute when locale changes:

**File: `src/routes/+layout.svelte`**

```svelte
<script>
  import { locale } from 'svelte-i18n';
  import { browser } from '$app/environment';

  $: if (browser && $locale) {
    document.documentElement.lang = $locale;
  }
</script>

<svelte:head>
  <title>My App</title>
</svelte:head>

<slot />
```

## Nested translations and interpolation

### Nested translation keys

**File: `src/locales/en.json`**

```json
{
  "user": {
    "profile": {
      "title": "User Profile",
      "name": "Name",
      "email": "Email"
    },
    "settings": {
      "title": "Settings",
      "theme": "Theme",
      "notifications": "Notifications"
    }
  }
}
```

**Component usage:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
</script>

<h1>{$_('user.profile.title')}</h1>
<label>{$_('user.profile.name')}</label>

<h2>{$_('user.settings.title')}</h2>
<label>{$_('user.settings.theme')}</label>
```

### Variable interpolation

**File: `src/locales/en.json`**

```json
{
  "greeting": "Hello, {name}!",
  "itemCount": "You have {count} item{count > 1 ? 's' : ''}",
  "welcome": "Welcome back, {firstName} {lastName}!"
}
```

**Component usage:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
  
  const user = { name: 'Alice' };
  const count = 5;
</script>

<p>{$_('greeting', { values: { name: user.name } })}</p>
<p>{$_('itemCount', { values: { count } })}</p>
```

## Pluralization rules

### Simple pluralization

**File: `src/locales/en.json`**

```json
{
  "messages": "{count} message{count !== 1 ? 's' : ''}",
  "items": "{count} item | {count} items",
  "apples": "no apples | one apple | many apples"
}
```

**Component usage:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
</script>

<p>{$_('messages', { values: { count: 5 } })}</p>
<p>{$_('items', { values: { count: 1 } })}</p>
<p>{$_('apples', { values: { count: 0 } })}</p>
```

### Advanced pluralization with format

```json
{
  "users.following": "{count} person following | {count} people following",
  "achievements": "{count} achievement unlocked | {count} achievements unlocked"
}
```

## Formatting: dates, numbers, and currency

### Date formatting

**File: `src/lib/i18n.ts` (with formats configuration)**

```typescript
init({
  fallbackLocale: 'en',
  initialLocale: 'en',
  formats: {
    date: {
      short: { month: 'numeric', day: 'numeric', year: '2-digit' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
      timestamp: {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    },
  },
  messages: { /* ... */ },
});
```

**Component usage:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
  
  const postDate = new Date('2025-01-15');
</script>

<p>Posted: {$_('date.short', { value: postDate })}</p>
<p>Posted: {$_('date.long', { value: postDate })}</p>
```

### Number and currency formatting

**File: `src/lib/i18n.ts`**

```typescript
init({
  formats: {
    number: {
      scientific: { notation: 'scientific' },
      engineering: { notation: 'engineering' },
      compact: { notation: 'compact' },
      percent: { style: 'percent' },
      USD: { style: 'currency', currency: 'USD' },
      EUR: { style: 'currency', currency: 'EUR' },
      JPY: { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 },
    },
  },
  messages: { /* ... */ },
});
```

**Component usage:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
</script>

<p>Price: {$_('number.USD', { value: 99.99 })}</p>
<p>Price: {$_('number.EUR', { value: 85.50 })}</p>
<p>Percentage: {$_('number.percent', { value: 0.42 })}</p>
```

## Performance optimization

### Lazy loading translations by locale

Only load the user's selected locale initially, then lazy-load others:

**File: `src/lib/i18n.ts`**

```typescript
import { init, getLocaleFromNavigator, locale } from 'svelte-i18n';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de'];

async function loadLocaleMessages(loc: string) {
  try {
    return (await import(`../locales/${loc}.json`)).default;
  } catch (err) {
    return (await import('../locales/en.json')).default;
  }
}

export async function initializeI18n() {
  const initialLocale = getLocaleFromNavigator() || 'en';

  // Load only the initial locale
  init({
    fallbackLocale: 'en',
    initialLocale,
    messages: {
      [initialLocale]: await loadLocaleMessages(initialLocale),
    },
  });

  // Lazy-load other locales when user switches
  locale.subscribe(async (current) => {
    if (current && !SUPPORTED_LOCALES.includes(current)) return;

    try {
      const messages = await loadLocaleMessages(current);
      locale.register(current, messages); // Register on-demand
    } catch (err) {
      console.error(`Failed to load locale: ${current}`);
    }
  });
}
```

### Register new locales dynamically

```typescript
import { locale } from 'svelte-i18n';

async function switchLocale(newLocale: string) {
  const messages = await loadLocaleMessages(newLocale);
  locale.register(newLocale, messages); // Add to i18n
  locale.set(newLocale); // Switch to it
}
```

### Code splitting by feature

Split locale files by feature/page to reduce initial bundle:

```
src/locales/en/
├── common.json          (loaded upfront)
├── auth.json            (loaded when user navigates to auth)
├── dashboard.json       (loaded when user navigates to dashboard)
└── admin/
    ├── settings.json
    └── users.json
```

**File: `src/lib/loaders/localeLoader.ts`**

```typescript
const localeModules: Record<string, Record<string, () => Promise<any>>> = {
  en: {
    common: () => import('../locales/en/common.json'),
    auth: () => import('../locales/en/auth.json'),
    dashboard: () => import('../locales/en/dashboard.json'),
  },
  es: {
    common: () => import('../locales/es/common.json'),
    auth: () => import('../locales/es/auth.json'),
    // ...
  },
};

export async function loadLocaleModule(
  locale: string,
  module: string
) {
  const loader = localeModules[locale]?.[module];
  if (!loader) return {};
  return (await loader()).default;
}
```

## SvelteKit integration

### SSR considerations

Since svelte-i18n uses browser APIs (localStorage, navigator), initialize carefully in SvelteKit:

**File: `src/routes/+layout.svelte` (universal layout)**

```svelte
<script>
  import { dev } from '$app/environment';
  import { browser } from '$app/environment';
  import { locale } from 'svelte-i18n';
  import { initializeI18n } from '$lib/i18n';
  import type { LayoutLoad } from './$types';

  export let data: LayoutLoad;

  // Initialize only on client (not server)
  if (browser) {
    initializeI18n();
  }
</script>

<main>
  <slot />
</main>
```

### Server-side rendering with locale

For better SSR, detect locale on server and pass to client:

**File: `src/routes/+layout.server.ts`**

```typescript
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
  // Detect locale from headers (Accept-Language or custom header)
  const acceptLanguage = request.headers.get('Accept-Language') || 'en';
  const locale = acceptLanguage.split(',')[0].split('-')[0]; // e.g., "en", "es"

  return {
    locale,
  };
};
```

**File: `src/routes/+layout.svelte`**

```svelte
<script>
  import { browser } from '$app/environment';
  import { locale } from 'svelte-i18n';
  import { initializeI18n } from '$lib/i18n';
  import type { LayoutLoad } from './$types';

  export let data: LayoutLoad;

  // Initialize with server-detected locale
  if (browser) {
    initializeI18n();
    if (data.locale) {
      locale.set(data.locale);
    }
  }
</script>

<slot />
```

### Passing locale to endpoints

For API calls that need locale awareness:

**File: `src/routes/api/user/+server.ts`**

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  const locale = request.headers.get('x-locale') || 'en';

  // Use locale to fetch translated content or format responses
  const userData = {
    name: 'Alice',
    locale,
    timestamp: new Date().toLocaleDateString(locale),
  };

  return json(userData);
};
```

**Client-side usage:**

```typescript
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';

async function fetchUserData() {
  const currentLocale = get(locale);

  const response = await fetch('/api/user', {
    headers: {
      'x-locale': currentLocale,
    },
  });

  return response.json();
}
```

## Common patterns and best practices

### 1. Missing key fallback

Always define fallback text for missing translations:

```svelte
<p>{$_('missing.key', { default: 'Default text' })}</p>
```

### 2. Dynamic key construction (use sparingly)

```typescript
import { _ } from 'svelte-i18n';

const section = 'user';
const field = 'email';
const key = `${section}.${field}`; // "user.email"

$_('key', { values: { key } }) // ❌ Won't work; $_ expects literal keys
```

**Better approach:**

```svelte
<script>
  import { _ } from 'svelte-i18n';
  
  function getLabel(section: string, field: string) {
    // Use a mapping instead of dynamic keys
    const labels: Record<string, Record<string, string>> = {
      user: { email: 'Email', name: 'Name' },
      settings: { theme: 'Theme', language: 'Language' }
    };
    return labels[section]?.[field] || 'Unknown';
  }
</script>

<label>{getLabel('user', 'email')}</label>
```

### 3. Translation missing detection (dev mode)

Track missing translations during development:

**File: `src/lib/i18n.ts`**

```typescript
import { init, getLocaleFromNavigator, _ } from 'svelte-i18n';

init({
  fallbackLocale: 'en',
  initialLocale: 'en',
  messages: { /* ... */ },
});

// Log missing translations in dev mode
if (import.meta.env.DEV) {
  _.subscribe((t) => {
    // Intercept translation function calls
  });
}
```

### 4. Namespaced translation keys (alias approach)

```json
{
  "auth": {
    "login": {
      "title": "Sign In",
      "email": "Email Address",
      "password": "Password",
      "submit": "Sign In",
      "forgot": "Forgot Password?"
    }
  },
  "auth.login.title": "Sign In",
  "auth.login.email": "Email Address"
}
```

### 5. Using with form validation

```svelte
<script>
  import { _ } from 'svelte-i18n';
  
  let errors: Record<string, string> = {};
  
  function validateForm(data: any) {
    errors = {};
    
    if (!data.email) {
      errors.email = $_('errors.required', { default: 'Required' });
    }
    if (!data.name) {
      errors.name = $_('errors.required', { default: 'Required' });
    }
    
    return Object.keys(errors).length === 0;
  }
</script>

<form on:submit|preventDefault={(e) => validateForm(e.currentTarget)}>
  <div>
    <input type="email" name="email" required />
    {#if errors.email}
      <span class="error">{errors.email}</span>
    {/if}
  </div>
</form>
```

## Common gotchas

| Problem | Cause | Solution |
|---------|-------|----------|
| Translations not loading | Import path incorrect or locale not registered | Verify JSON file paths and ensure locale is added to messages object |
| `$_` is undefined | svelte-i18n not initialized | Call `init()` before using `$_` in components |
| Locale doesn't persist | Not saving to localStorage | Use custom store or add persistence in locale setter |
| SSR flash of wrong language | Server doesn't know client's locale | Pass server-detected locale to layout data |
| Performance slow with many keys | All locales loaded upfront | Implement lazy loading or code splitting by feature |
| Interpolation not working | Using `$_` without `values` prop | Always pass `values: { key: value }` object |

## Reference

**Official svelte-i18n documentation**: https://github.com/kaisermann/svelte-i18n

**Intl API reference**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

**Related skills**: [software-architecture](../software-architecture/SKILL.md), [frontend-design](../frontend-design/SKILL.md)
