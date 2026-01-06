# Localization System

A type-safe, lightweight internationalization (i18n) system for GoPayShortcuts with support for Danish and English.

## Overview

The localization system is designed to be:
- **Type-safe**: Full TypeScript support with strict mode
- **Lightweight**: No heavy i18n libraries, just native TypeScript
- **Reactive**: Svelte 5 stores for reactive language switching
- **Persistent**: Automatically saves language preference to localStorage
- **Smart**: Detects browser language on first load
- **Organized**: Hierarchical translation structure by feature

## Structure

### Files

- **translations.ts** - Translation object with all UI strings for Danish (da) and English (en)
- **i18nStore.ts** - Reactive Svelte store for managing current language and translations
- **dateFormatter.ts** - Date formatting utilities that respect current language
- **index.ts** - Convenient re-exports of all utilities

## Usage

### Basic Translation

```svelte
<script lang="ts">
  import { t } from '$lib/features/localization';
  
  // Get translation immediately (synchronous)
  const emailLabel = t('auth.email');
</script>

<label>{emailLabel}</label>
```

### Reactive Store Usage

```svelte
<script lang="ts">
  import { i18n } from '$lib/features/localization';
  
  // Subscribe to language changes
  let language = $state('da');
  
  $effect(() => {
    const unsubscribe = i18n.subscribe(state => {
      language = state.currentLanguage;
    });
    return unsubscribe;
  });
</script>

<select bind:value={language} onchange={() => i18n.setLanguage(language)}>
  <option value="da">Dansk</option>
  <option value="en">English</option>
</select>
```

### Date Formatting

```svelte
<script lang="ts">
  import { formatDate, formatDateTime, formatRelativeTime } from '$lib/features/localization';
  
  const date = new Date('2024-01-15');
  
  // Format respects current language
  const formatted = formatDate(date);              // "15. jan. 2024" (da) or "Jan 15, 2024" (en)
  const withTime = formatDateTime(date);           // "15. jan. 2024 14:30" (da)
  const relative = formatRelativeTime(date);       // "2 days ago" etc.
</script>
```

## API Reference

### Store Functions

#### `i18n.setLanguage(lang: Language)`

Sets the current language and persists to localStorage.

```ts
i18n.setLanguage('en');
```

#### `i18n.getLanguage(): Language`

Gets the current language.

```ts
const currentLang = i18n.getLanguage(); // 'da' | 'en'
```

#### `i18n.t(key: string): string`

Gets a translation via the store instance.

```ts
const text = i18n.t('auth.email');
```

#### `t(key: string): string`

Standalone translation function (recommended for templates).

```ts
const text = t('auth.login');
```

#### `getSupportedLanguage(lang: string): Language`

Converts browser language codes to supported languages.

```ts
getSupportedLanguage('da-DK');  // returns 'da'
getSupportedLanguage('en-GB');  // returns 'en'
getSupportedLanguage('fr-FR');  // returns 'da' (default)
```

#### `getTranslation(key: string, lang?: Language): string`

Gets a translation with optional language override.

```ts
getTranslation('auth.email', 'en');      // English version
getTranslation('auth.email', 'da');      // Danish version
getTranslation('auth.email');            // Current language
```

### Date Formatting Functions

All date functions respect the current language and can take an optional language override.

#### `formatDate(date: Date | number, formatStr?: string, lang?: Language): string`

Formats a date with optional custom format string.

```ts
formatDate(new Date());                    // "15. jan. 2024" (da)
formatDate(new Date(), 'yyyy-MM-dd');      // "2024-01-15"
formatDate(new Date(), undefined, 'en');   // "Jan 15, 2024"
```

#### `formatDateTime(date: Date | number, lang?: Language): string`

Formats date and time together.

```ts
formatDateTime(new Date());  // "15. jan. 2024 14:30" (da) or "Jan 15, 2024 14:30" (en)
```

#### `formatTime(date: Date | number, lang?: Language): string`

Formats time only.

```ts
formatTime(new Date());  // "14:30"
```

#### `formatDateRelative(date: Date | number, lang?: Language): string`

Formats date with smart relative labels.

```ts
formatDateRelative(new Date());           // "I dag" (da) or "Today" (en)
formatDateRelative(new Date(-86400000));  // "I går" (da) or "Yesterday" (en)
```

#### `formatDateRange(startDate, endDate, lang?: Language): string`

Formats a date range.

```ts
formatDateRange(start, end);  // "15. jan - 20. jan 2024" (da)
```

#### `formatRelativeTime(date: Date | number, lang?: Language): string`

Formats relative time (ago/from now).

```ts
formatRelativeTime(new Date(Date.now() - 3600000));  // "1 hour ago" (en)
```

#### `formatDuration(durationMs: number, lang?: Language): string`

Formats a duration.

```ts
formatDuration(3661000);  // "1h 1m" (en) or "1t 1m" (da)
```

#### `getWeekNumber(date: Date | number): number`

Gets the ISO week number.

```ts
getWeekNumber(new Date('2024-01-15'));  // 3
```

#### `isFuture(date: Date | number): boolean`

Checks if a date is in the future.

```ts
isFuture(new Date(Date.now() + 86400000));  // true
```

#### `isPast(date: Date | number): boolean`

Checks if a date is in the past.

```ts
isPast(new Date(Date.now() - 86400000));  // true
```

## Translation Structure

Translations are organized hierarchically by feature/domain:

```
auth/
  email, emailPlaceholder, login, etc.

orders/
  title, orderNumber, date, total, etc.

products/
  title, productName, price, etc.

locations/
  title, name, address, etc.

menu/
  home, orders, products, etc.

common/
  loading, error, success, yes, no, etc.

dateTime/
  formatDate, formatDateTime, today, yesterday, etc.

validation/
  required, email, minLength, etc.
```

## Browser Language Detection

The system automatically detects the user's preferred language:

1. Checks localStorage for saved 'language-preference'
2. If not found, checks `navigator.language` (e.g., 'da-DK' → 'da')
3. Defaults to Danish ('da') if neither matches

The detected language is automatically saved to localStorage for persistence across sessions.

## Adding New Translations

1. Add the new key-value pair to both `translations.da` and `translations.en`
2. Follow the hierarchical structure (e.g., `feature.action`)
3. Keep keys in alphabetical order within each section

Example:

```ts
export const translations = {
  da: {
    myFeature: {
      actionName: 'Min handling',
      actionDescription: 'Beskrivelse af handling',
    },
  },
  en: {
    myFeature: {
      actionName: 'My action',
      actionDescription: 'Description of action',
    },
  },
};
```

## Type Safety

The system is fully type-safe with strict TypeScript mode:

```ts
// TypeScript will help with autocomplete and catch typos
const text = t('auth.email');        // ✓ Valid
const text = t('auth.invalidKey');   // Falls back gracefully
```

## Fallback Behavior

If a translation key is not found in the target language, the system:

1. Falls back to Danish (if target is not Danish)
2. Returns the key itself as a last resort (helps identify missing translations)

## Storage

- Language preference is saved to localStorage with key: `language-preference`
- Values: `'da'` or `'en'`
- Automatically persisted on language change
- Loaded on app initialization

## Integration with Components

### In Svelte Components

```svelte
<script lang="ts">
  import { t, formatDate } from '$lib/features/localization';
</script>

<button>{t('common.save')}</button>
<span>{formatDate(new Date())}</span>
```

### In Server-Side Code

```ts
import { getTranslation, getSupportedLanguage } from '$lib/features/localization';

const userLang = getSupportedLanguage(request.headers.get('accept-language'));
const text = getTranslation('auth.email', userLang);
```

## Performance Considerations

- **Lightweight**: No runtime dependencies beyond date-fns (already installed)
- **Tree-shakeable**: Import only what you need
- **Lazy translations**: Translations are only compiled when accessed
- **Efficient store**: Uses Svelte's built-in readable store pattern
- **No re-renders**: Language changes only trigger necessary updates

## Future Enhancements

Potential additions without adding complexity:

- Message interpolation: `t('validation.minLength', { min: 5 })`
- Pluralization support: `t('items.count', { count: 5 })`
- Translation debugging: Show missing keys in development
- Namespace extraction: Compile translation statistics

## Testing

When testing components that use localization:

```ts
import { i18n } from '$lib/features/localization';

// Set language for test
i18n.setLanguage('en');

// Test with specific language
const text = i18n.t('auth.email');
```

## Examples

### Language Switcher Component

```svelte
<script lang="ts">
  import { i18n } from '$lib/features/localization';

  let currentLang = $state('da');

  function handleLanguageChange(newLang: 'da' | 'en') {
    currentLang = newLang;
    i18n.setLanguage(newLang);
  }
</script>

<select {value} onchange={(e) => handleLanguageChange(e.target.value)}>
  <option value="da">Dansk</option>
  <option value="en">English</option>
</select>
```

### Order List with Formatted Dates

```svelte
<script lang="ts">
  import { t, formatDate } from '$lib/features/localization';

  const orders = [
    { id: 1, date: new Date('2024-01-15'), total: 1500 },
  ];
</script>

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
        <td>{formatDate(order.date)}</td>
        <td>{order.total} kr</td>
      </tr>
    {/each}
  </tbody>
</table>
```
