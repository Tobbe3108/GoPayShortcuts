/**
 * Component Integration Examples for i18n System
 *
 * This file contains practical before/after code examples showing how to refactor
 * GoPayShortcuts components to use the i18n system. Each example demonstrates:
 *
 * 1. Original hardcoded strings in the component
 * 2. Refactored version using the i18n system
 * 3. Key patterns and best practices
 * 4. How to use the t() function in different contexts
 *
 * IMPORTANT: These are reference examples only. Do NOT directly copy-paste into components.
 * Always adapt to your specific component's needs and patterns.
 *
 * @see index.ts - Main i18n exports
 * @see i18nStore.ts - Store implementation
 * @see translations.ts - Translation keys and strings
 */

// =============================================================================
// USAGE GUIDE
// =============================================================================
//
// In a Svelte component, you have two main options:
//
// 1. DIRECT IMPORT (Recommended for most components)
//    - Import t() function at the top
//    - Use directly in template: {t('auth.email')}
//    - Simple, clean, works everywhere
//
// 2. STORE SUBSCRIPTION (For reactive language switching)
//    - Subscribe to i18n store to react to language changes
//    - Use when you need real-time updates during language switch
//    - More complex but useful for dynamic content
//
// =============================================================================

// =============================================================================
// EXAMPLE 1: AuthForm.svelte - Email/OTP Form Refactoring
// =============================================================================

/**
 * BEFORE: Hardcoded Danish strings
 *
 * Problems:
 * - Strings hardcoded in template
 * - No English support
 * - Difficult to maintain and update
 * - Validation messages are hardcoded
 */
const AUTHFORM_BEFORE = `
<script lang="ts">
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';

  type AuthFormProps = {
    isEmailStep?: boolean;
    email?: string;
    otp?: string;
    isLoading?: boolean;
    onEmailSubmit?: (email: string) => void;
    onOtpSubmit?: (otp: string) => void;
    onBackToEmail?: () => void;
  };

  let {
    isEmailStep = true,
    email = $bindable(''),
    otp = $bindable(''),
    isLoading = false,
    onEmailSubmit = (email: string) => {},
    onOtpSubmit = (otp: string) => {},
    onBackToEmail = () => {}
  }: AuthFormProps = $props();

  const validateEmail = (v: string): boolean => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
</script>

{#if isEmailStep}
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); onEmailSubmit(email); }}>
    <FormField
      id="email"
      label="Email adresse"                    {/* HARDCODED */}
      type="email"
      placeholder="Indtast din email"          {/* HARDCODED */}
      bind:value={email}
    />
    <Button type="submit" disabled={isLoading || !validateEmail(email)} fullWidth={true}>
      {#snippet children()}
        {#if isLoading}
          <span class="ml-2">Sender...</span>  {/* HARDCODED */}
        {:else}
          Fortsæt                              {/* HARDCODED */}
        {/if}
      {/snippet}
    </Button>
  </form>
{:else}
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); onOtpSubmit(otp); }}>
    <FormField
      id="otp"
      label="Verifikationskode"                {/* HARDCODED */}
      type="text"
      placeholder="Indtast verifikationskode"  {/* HARDCODED */}
      bind:value={otp}
    />
    <div class="space-y-2">
      <Button type="submit" disabled={isLoading || otp.length === 0} fullWidth={true}>
        {#snippet children()}
          {#if isLoading}
            <span class="ml-2">Verificerer...</span> {/* HARDCODED */}
          {:else}
            Log ind                                   {/* HARDCODED */}
          {/if}
        {/snippet}
      </Button>
      <Button type="button" variant="transparent" size="sm" onclick={() => onBackToEmail()}>
        Tilbage {/* HARDCODED */}
      </Button>
    </div>
  </form>
{/if}
`;

/**
 * AFTER: Using i18n system
 *
 * Benefits:
 * - Full multi-language support
 * - Centralized strings in translations.ts
 * - Easy to maintain and update
 * - Validation messages in translations
 * - Form labels are consistent across the app
 */
const AUTHFORM_AFTER = `
<script lang="ts">
  import FormField from '$lib/components/molecules/FormField.svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
  import { t } from '$lib/features/localization'; // ✅ Import translation function

  type AuthFormProps = {
    isEmailStep?: boolean;
    email?: string;
    otp?: string;
    isLoading?: boolean;
    onEmailSubmit?: (email: string) => void;
    onOtpSubmit?: (otp: string) => void;
    onBackToEmail?: () => void;
  };

  let {
    isEmailStep = true,
    email = $bindable(''),
    otp = $bindable(''),
    isLoading = false,
    onEmailSubmit = (email: string) => {},
    onOtpSubmit = (otp: string) => {},
    onBackToEmail = () => {}
  }: AuthFormProps = $props();

  const validateEmail = (v: string): boolean => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
</script>

{#if isEmailStep}
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); onEmailSubmit(email); }}>
    <FormField
      id="email"
      label={t('auth.emailLabel')}              {/* ✅ Use t() function */}
      type="email"
      placeholder={t('auth.emailPlaceholder')}  {/* ✅ Use t() function */}
      bind:value={email}
    />
    <Button type="submit" disabled={isLoading || !validateEmail(email)} fullWidth={true}>
      {#snippet children()}
        {#if isLoading}
          <LoadingSpinner size="w-5 h-5" />
          <span class="ml-2">{t('auth.sending')}</span>  {/* ✅ Use t() function */}
        {:else}
          {t('auth.continue')}                          {/* ✅ Use t() function */}
        {/if}
      {/snippet}
    </Button>
  </form>
{:else}
  <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); onOtpSubmit(otp); }}>
    <FormField
      id="otp"
      label={t('auth.verificationCodeLabel')}  {/* ✅ Use t() function */}
      type="text"
      placeholder={t('auth.verificationPlaceholder')}  {/* ✅ Use t() function */}
      bind:value={otp}
    />
    <div class="space-y-2">
      <Button type="submit" disabled={isLoading || otp.length === 0} fullWidth={true}>
        {#snippet children()}
          {#if isLoading}
            <LoadingSpinner size="w-5 h-5" />
            <span class="ml-2">{t('auth.verifying')}</span>  {/* ✅ Use t() function */}
          {:else}
            {t('auth.login')}                               {/* ✅ Use t() function */}
          {/if}
        {/snippet}
      </Button>
      <Button type="button" variant="transparent" size="sm" onclick={() => onBackToEmail()}>
        {t('auth.back')}  {/* ✅ Use t() function */}
      </Button>
    </div>
  </form>
{/if}
`;

/**
 * PATTERN: Basic Template Usage
 *
 * Key points:
 * 1. Import { t } from '$lib/features/localization' at the top
 * 2. Use t('key') anywhere in the template
 * 3. Key format follows translation structure: feature.string
 * 4. t() automatically uses the current language from the store
 */
const PATTERN_BASIC_TEMPLATE = `
<script lang="ts">
  import { t } from '$lib/features/localization';
</script>

<!-- Simple string replacement -->
<label for="email">{t('auth.emailLabel')}</label>
<input placeholder={t('auth.emailPlaceholder')} />

<!-- In conditional blocks -->
{#if isLoading}
  <span>{t('auth.sending')}</span>
{:else}
  <span>{t('auth.continue')}</span>
{/if}

<!-- In event handlers (captured at call time) -->
<button onclick={() => console.log(t('common.success'))}>
  {t('common.save')}
</button>
`;

// =============================================================================
// EXAMPLE 2: OrderCard.svelte - Order Display and Notifications
// =============================================================================

/**
 * BEFORE: Hardcoded error/info messages
 *
 * Problems:
 * - User-facing messages hardcoded in component logic
 * - No internationalization
 * - Difficult to update messages globally
 * - Inconsistent message formatting
 */
const ORDERCARD_BEFORE = `
async function handleSave() {
  if (isLocked) {
    for (const line of order.orderlines) {
      const originalQty = originalQuantities.get(line.productId) ?? 0;
      if (line.quantity < originalQty) {
        notifications.error(
          'Cannot decrease quantities in a locked order. Only additions are allowed.'  // HARDCODED
        );
        return;
      }
    }
  }

  isBackendLoading = true;
  try {
    const response = await ordersService.updateDay({...});
    if (response) onOrderChange?.(response);
    editMode = false;
    notifications.info(undefined, 2500, 'Save as default?', async () => handleSaveAsDefault());
  } catch (err) {
    notifications.error('Failed to save order');  // HARDCODED
  } finally {
    isBackendLoading = false;
  }
}

async function handleSaveAsDefault() {
  isBackendLoading = true;
  try {
    await defaultStore.saveDefault(order);
  } catch (err) {
    notifications.error('Failed to save default order');  // HARDCODED
  } finally {
    isBackendLoading = false;
  }
}

async function handleDelete() {
  isBackendLoading = true;
  try {
    await ordersService.updateDay({...});
    onOrderCancel?.(order.date, order.kitchenId);
  } catch (err) {
    notifications.error('Failed to cancel order');  // HARDCODED
  } finally {
    isBackendLoading = false;
  }
}
`;

/**
 * AFTER: Using i18n system for notifications
 *
 * Benefits:
 * - Consistent error messages across the app
 * - Easy to update messages in translations.ts
 * - Full multi-language support
 * - Centralized message management
 *
 * Translation keys structure needed in translations.ts:
 * {
 *   orders: {
 *     lockedOrderError: 'Cannot decrease quantities in a locked order...',
 *     saveError: 'Failed to save order',
 *     deleteSuccess: 'Order deleted',
 *     savingOrder: 'Saving order...',
 *   }
 * }
 */
const ORDERCARD_AFTER = `
<script lang="ts">
  import { t } from '$lib/features/localization';  // ✅ Import translation function
  // ... other imports
</script>

{/* In the component logic */}

async function handleSave() {
  // Validate append-only constraint
  if (isLocked) {
    for (const line of order.orderlines) {
      const originalQty = originalQuantities.get(line.productId) ?? 0;
      if (line.quantity < originalQty) {
        notifications.error(
          t('orders.lockedOrderError')  // ✅ Use i18n for error message
        );
        return;
      }
    }
  }

  if (order.orderlines.every((line) => line.quantity === 0)) {
    handleDelete();
    return;
  }

  isBackendLoading = true;
  try {
    const response = await ordersService.updateDay({
      kitchenId: order.kitchenId,
      date: order.date,
      desiredOrders: order.orderlines
    });
    if (response) onOrderChange?.(response);
    editMode = false;
    // Success message with action suggestion
    notifications.info(
      t('orders.saveSuccess'),              // ✅ Use i18n for success
      2500,
      t('orders.saveAsDefault'),            // ✅ Use i18n for action label
      async () => handleSaveAsDefault()
    );
  } catch (err) {
    notifications.error(t('orders.saveError'));  // ✅ Use i18n for error
  } finally {
    isBackendLoading = false;
  }
}

async function handleSaveAsDefault() {
  isBackendLoading = true;
  try {
    await defaultStore.saveDefault(order);
  } catch (err) {
    notifications.error(t('orders.saveDefaultError'));  // ✅ Use i18n for error
  } finally {
    isBackendLoading = false;
  }
}

async function handleDelete() {
  isBackendLoading = true;
  try {
    await ordersService.updateDay({
      kitchenId: order.kitchenId,
      date: order.date,
      desiredOrders: []
    });
    onOrderCancel?.(order.date, order.kitchenId);
    notifications.success(t('orders.deleteSuccess'));  // ✅ Use i18n for success
  } catch (err) {
    notifications.error(t('orders.deleteError'));  // ✅ Use i18n for error
  } finally {
    isBackendLoading = false;
  }
}
`;

/**
 * PATTERN: Using i18n in Component Logic
 *
 * Key points:
 * 1. Import { t } from '$lib/features/localization'
 * 2. Call t() at the point where the string is needed
 * 3. Use for all user-facing messages (notifications, alerts, etc.)
 * 4. t() works in any scope (functions, event handlers, reactives)
 * 5. For dynamic messages, consider parameterized translations in future
 */
const PATTERN_LOGIC_USAGE = `
<script lang="ts">
  import { t } from '$lib/features/localization';
  import { notifications } from '$lib/core/notifications/notificationStore';

  // ✅ Use in try/catch blocks
  async function handleSave() {
    try {
      await saveOrder();
      notifications.success(t('orders.saveSuccess'));
    } catch (err) {
      notifications.error(t('orders.saveError'));
    }
  }

  // ✅ Use in validation
  function validateForm(data: FormData): string | null {
    if (!data.email) return t('validation.required');
    if (!isValidEmail(data.email)) return t('validation.email');
    return null;
  }

  // ✅ Use in derived reactive values
  const statusLabel = \$derived(
    order.status === 'pending'
      ? t('orders.status.pending')
      : t('orders.status.completed')
  );

  // ✅ Use in event handlers
  function handleClick() {
    const message = t('common.confirmDelete');
    if (confirm(message)) {
      deleteOrder();
    }
  }
</script>
`;

// =============================================================================
// EXAMPLE 3: DayViewTemplate.svelte - Navigation and Messages
// =============================================================================

/**
 * BEFORE: Hardcoded navigation and status messages
 *
 * Problems:
 * - Multiple hardcoded strings in conditionals
 * - Messages not centralized
 * - Difficult to maintain consistency
 * - No multi-language support
 */
const DAYVIEWTEMPLATE_BEFORE = `
<div class="grid grid-cols-1 gap-4">
  {#if !loading}
    {#if isPast(selectedDate) && !isToday(selectedDate) && [...ordersByDay(orders, selectedDate)].length === 0}
      <Card>
        <div class="text-xs text-gray-400 text-center">
          Bestillinger kan ikke placeres for fortidige dage.  {/* HARDCODED */}
        </div>
      </Card>
    {/if}

    {#if (isToday(selectedDate) || isFuture(selectedDate)) && [...ordersByDay(orders, selectedDate)].length === 0}
      <Card>
        {#if hasDefaultOrder}
          <div class="flex justify-center">
            <Button variant="transparent" size="sm" ariaLabel="Use default order">
              <div class="text-xs text-gray-400 text-center">Use default order</div>  {/* HARDCODED */}
            </Button>
          </div>
        {:else}
          <div class="text-xs text-gray-400 text-center">
            Save an order as default to quickly reuse it  {/* HARDCODED */}
          </div>
        {/if}
      </Card>
    {/if}

    {#each ordersByDay(orders, selectedDate) as order (order.kitchenId)}
      <OrderCard {...} />
    {/each}
  {/if}
</div>
`;

/**
 * AFTER: Using i18n for all text content
 *
 * Benefits:
 * - Consistent messaging across the app
 * - Easy to update all messages in one place
 * - Full internationalization support
 * - Cleaner, more maintainable code
 */
const DAYVIEWTEMPLATE_AFTER = `
<script lang="ts">
  import { t } from '$lib/features/localization';  // ✅ Import translation function
  import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
  import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
  // ... other imports

  type DayViewProps = {
    date: Date;
  };

  let { date }: DayViewProps = $props();
  
  let selectedDate = \$derived(date);
  let weekStart = \$derived(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  let weekEnd = \$derived(endOfWeek(selectedDate, { weekStartsOn: 1 }));
  
  let loading = \$state(true);
  let orders: Record<string, TemplateOrder[]> = \$state({});
  let hasDefaultOrder = \$state(false);
  
  // ... effect logic
</script>

<div class="grid grid-cols-1 gap-4">
  <TodaysMenu date={selectedDate} />
  {#if !loading}
    {#key format(selectedDate, 'yyyy-MM-dd')}
      <div in:fade class="flex flex-col space-y-4 w-full">
        
        {/* Past date message */}
        {#if isPast(selectedDate) && !isToday(selectedDate) && [...ordersByDay(orders, selectedDate)].length === 0}
          <Card>
            <div class="text-xs text-gray-400 text-center">
              {t('orders.pastDateMessage')}  {/* ✅ Use i18n */}
            </div>
          </Card>
        {/if}

        {/* Current/future date with no orders */}
        {#if (isToday(selectedDate) || isFuture(selectedDate)) && [...ordersByDay(orders, selectedDate)].length === 0}
          <Card>
            {#if hasDefaultOrder}
              <div class="flex justify-center">
                <Button
                  variant="transparent"
                  size="sm"
                  ariaLabel={t('orders.useDefaultAriaLabel')}  {/* ✅ Use i18n for a11y */}
                  onclick={async () => {
                    const def = await defaultStore.getDefault();
                    if (!def) {
                      notifications.info(t('orders.noDefaultOrder'));  {/* ✅ Use i18n */}
                      return;
                    }
                    // ... rest of logic
                  }}
                >
                  <div class="text-xs text-gray-400 text-center">
                    {t('orders.useDefaultLabel')}  {/* ✅ Use i18n */}
                  </div>
                </Button>
              </div>
            {:else}
              <div class="text-xs text-gray-400 text-center">
                {t('orders.saveDefaultHint')}  {/* ✅ Use i18n */}
              </div>
            {/if}
          </Card>
        {/if}

        {/* Orders list */}
        {#each ordersByDay(orders, selectedDate) as order (order.kitchenId)}
          <OrderCard
            {order}
            isEditing={order.tempOrder}
            onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
            onOrderCancel={(selectedDate, kitchenId) =>
              handleCancel(orders, selectedDate, kitchenId)}
          />
        {/each}

        {/* Add location card */}
        {#if isToday(date) || isFuture(date)}
          <AddLocationCard
            date={selectedDate}
            newOrder={(newOrder) => updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
            locationsWithOrders={[...ordersByDay(orders, selectedDate)].map((o) => o.kitchenId)}
          />
        {/if}
      </div>
    {/key}
  {/if}
</div>
`;

/**
 * PATTERN: Conditional Strings with i18n
 *
 * Key points:
 * 1. Use t() in template expressions
 * 2. Works with conditionals, loops, and bindings
 * 3. Can use derived values for complex conditions
 * 4. Always call t() fresh - don't store in variables (auto-updates with language)
 */
const PATTERN_CONDITIONAL_STRINGS = `
<script lang="ts">
  import { t } from '$lib/features/localization';

  let status = 'pending';
</script>

<!-- ✅ Direct usage in conditionals -->
{#if isPast(date)}
  <p>{t('orders.pastDateMessage')}</p>
{:else if isToday(date)}
  <p>{t('orders.todayMessage')}</p>
{:else}
  <p>{t('orders.futureMessage')}</p>
{/if}

<!-- ✅ In loops with translation keys -->
{#each items as item}
  <p>{t(\`feature.\${item.type}Label\`)}</p>
{/each}

<!-- ✅ In derived values (will update with language change) -->
<script>
  const statusMessage = \$derived(
    status === 'pending' ? t('orders.pending') : t('orders.completed')
  );
</script>
<p>{statusMessage}</p>
`;

// =============================================================================
// EXAMPLE 4: MainLayout.svelte - Header and Logout Button
// =============================================================================

/**
 * BEFORE: Hardcoded logout button text
 *
 * Problems:
 * - Hardcoded Danish text only
 * - aria-label not descriptive
 * - No multi-language support
 */
const MAINLAYOUT_BEFORE = `
<div class="flex flex-1/3 justify-end">
  {#if isAuthenticated && page.url.pathname !== '/login'}
    <Button variant="primary" onclick={() => onLogout()}>
      {#snippet children()}
        Log ud  {/* HARDCODED */}
      {/snippet}
    </Button>
  {/if}
</div>
`;

/**
 * AFTER: Using i18n for logout button
 *
 * Benefits:
 * - Multi-language logout button
 * - Better accessibility with i18n aria-label
 * - Centralized button text
 * - Consistent with other auth strings
 */
const MAINLAYOUT_AFTER = `
<script lang="ts">
  import { t } from '$lib/features/localization';  // ✅ Import translation function
  // ... other imports

  type MainLayoutProps = {
    onLogout?: () => void;
    isAuthenticated?: boolean;
    children?: any;
    isMobile?: boolean;
    date: Date;
    onDayChange?: (newDate: Date) => void;
    onWeekChange?: (newWeekStart: Date) => void;
  };

  let {
    onLogout = () => {},
    isAuthenticated = false,
    children,
    isMobile = false,
    date,
    onDayChange = undefined,
    onWeekChange = undefined
  }: MainLayoutProps = \$props();

  function goToToday() {
    const today = new Date();
    if (isMobile) {
      onDayChange?.(today);
    } else {
      onWeekChange?.(today);
    }
  }
</script>

<div class="container max-w-[90vw] p-4 mx-auto">
  <div class="flex flex-row items-center">
    <div class="flex flex-1/3 justify-start">
      <button
        onclick={goToToday}
        class="cursor-pointer hover:opacity-75 transition-opacity"
        aria-label={t('common.goToToday')}  {/* ✅ Use i18n for a11y */}
        type="button"
      >
        <img src="{base}/GoPayBadEdition.png" alt={t('common.logoAlt')} class="h-16 sm:h-28 w-auto" />
      </button>
    </div>
    <div class="flex flex-1/3 justify-center">
      {#if isMobile}
        <DayNavigator {date} {onDayChange} />
      {:else}
        <WeekNavigator {date} {onWeekChange} />
      {/if}
    </div>
    <div class="flex flex-1/3 justify-end">
      {#if isAuthenticated && page.url.pathname !== '/login'}
        <Button
          variant="primary"
          onclick={() => onLogout()}
          ariaLabel={t('auth.logoutAriaLabel')}  {/* ✅ Use i18n for a11y */}
        >
          {#snippet children()}
            {t('auth.logout')}  {/* ✅ Use i18n for button text */}
          {/snippet}
        </Button>
      {/if}
    </div>
  </div>
  <div class="mt-6">{@render children?.()}</div>
</div>
`;

/**
 * PATTERN: Accessibility with i18n
 *
 * Key points:
 * 1. Use i18n for aria-label, aria-describedby, title attributes
 * 2. Keep aria labels clear and descriptive
 * 3. Translate both visible text and accessibility attributes
 * 4. Test with screen readers in multiple languages
 */
const PATTERN_ACCESSIBILITY = `
<script lang="ts">
  import { t } from '$lib/features/localization';
</script>

<!-- ✅ aria-label in multiple languages -->
<button aria-label={t('buttons.saveAriaLabel')}>
  {t('buttons.save')}
</button>

<!-- ✅ Title for tooltips -->
<button title={t('buttons.deleteAriaLabel')}>
  {t('buttons.delete')}
</button>

<!-- ✅ aria-describedby for complex interactions -->
<input
  aria-label={t('form.emailLabel')}
  aria-describedby="email-help"
/>
<p id="email-help">{t('form.emailHelp')}</p>

<!-- ✅ Role announcements -->
<div role="status" aria-live="polite">
  {t('orders.savingOrder')}
</div>
`;

// =============================================================================
// EXAMPLE 5: Validation Messages with i18n
// =============================================================================

/**
 * BEFORE: Hardcoded validation messages
 *
 * Problems:
 * - Messages hardcoded in validation functions
 * - No consistency across components
 * - Difficult to maintain messages
 * - No multi-language support
 */
const VALIDATION_BEFORE = `
// In component or validation service
function validateForm(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email er påkrævet';  // HARDCODED
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Venligst indtast en gyldig email adresse';  // HARDCODED
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Navn er påkrævet';  // HARDCODED
  } else if (data.name.length < 2) {
    errors.name = 'Navn skal være mindst 2 tegn';  // HARDCODED
  } else if (data.name.length > 50) {
    errors.name = 'Navn kan være maksimalt 50 tegn';  // HARDCODED
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Telefon er påkrævet';  // HARDCODED
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Venligst indtast et gyldigt telefonnummer';  // HARDCODED
  }

  return errors;
}

// In component
<script lang="ts">
  let errors = \$state<Record<string, string>>({});
  
  async function handleSubmit(formData: FormData) {
    errors = validateForm(formData);
    if (Object.keys(errors).length > 0) return;
    // ... submit
  }
</script>

<form onsubmit={handleSubmit}>
  <FormField bind:value={email} error={errors.email} />
  <FormField bind:value={name} error={errors.name} />
  <FormField bind:value={phone} error={errors.phone} />
</form>
`;

/**
 * AFTER: Using i18n for validation messages
 *
 * Benefits:
 * - Consistent validation messages across the app
 * - Centralized message management
 * - Multi-language support
 * - Easy to maintain and update
 * - Can share validation logic across components
 *
 * Translation keys needed in translations.ts:
 * {
 *   validation: {
 *     required: 'Dette felt er påkrævet',
 *     email: 'Venligst indtast en gyldig email adresse',
 *     minLength: 'Skal være mindst {0} tegn',
 *     maxLength: 'Kan være maksimalt {0} tegn',
 *     phone: 'Skal være et gyldigt telefonnummer',
 *   }
 * }
 */
const VALIDATION_AFTER = `
// In a shared validation service
<script lang="ts" context="module">
  import { t } from '$lib/features/localization';

  // ✅ Validation helper functions using i18n
  export function validateRequired(value: string | null | undefined): string | null {
    if (!value || value.trim().length === 0) {
      return t('validation.required');
    }
    return null;
  }

  export function validateEmail(email: string): string | null {
    if (!email) {
      return t('validation.required');
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return t('validation.email');
    }
    return null;
  }

  export function validateMinLength(value: string, minLength: number): string | null {
    if (value.length < minLength) {
      // For parameterized messages, you can implement helpers
      return t('validation.minLength').replace('{0}', minLength.toString());
    }
    return null;
  }

  export function validateMaxLength(value: string, maxLength: number): string | null {
    if (value.length > maxLength) {
      return t('validation.maxLength').replace('{0}', maxLength.toString());
    }
    return null;
  }

  export function validatePhone(phone: string): string | null {
    if (!phone) {
      return t('validation.required');
    }
    if (!/^[\\d+\\-\\s()]+$/.test(phone)) {
      return t('validation.phone');
    }
    return null;
  }

  export function validateForm(data: FormData): Record<string, string> {
    const errors: Record<string, string> = {};

    // ✅ Use validation helpers
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const nameError = validateRequired(data.name);
    if (nameError) errors.name = nameError;
    else {
      const minError = validateMinLength(data.name!, 2);
      if (minError) errors.name = minError;
      const maxError = validateMaxLength(data.name!, 50);
      if (maxError) errors.name = maxError;
    }

    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;

    return errors;
  }
</script>

// In component
<script lang="ts">
  import { validateForm } from '$lib/features/validation/validators';

  let errors = \$state<Record<string, string>>({});
  
  async function handleSubmit(formData: FormData) {
    errors = validateForm(formData);  // ✅ Use validation with i18n
    if (Object.keys(errors).length > 0) return;
    // ... submit
  }
</script>

<form onsubmit={handleSubmit}>
  <FormField bind:value={email} error={errors.email} />
  <FormField bind:value={name} error={errors.name} />
  <FormField bind:value={phone} error={errors.phone} />
</form>
`;

/**
 * PATTERN: Parameterized Validation Messages
 *
 * Key points:
 * 1. Create validation helper functions for consistency
 * 2. Import helpers instead of duplicating logic
 * 3. Use simple string replacement for parameterized messages
 * 4. Keep translation keys simple and reusable
 *
 * For more complex parameterization, consider:
 * - Implementing a translation helper with placeholders
 * - Using printf-style formatting library
 * - Creating domain-specific validation functions
 */
const PATTERN_PARAMETERIZED = `
<script lang="ts">
  import { t } from '$lib/features/localization';

  // Simple string replacement helper
  function tReplace(key: string, replacements: Record<string, string>): string {
    let result = t(key);
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(\`{\${placeholder}}\`, value);
    }
    return result;
  }

  // Example usage
  const minLengthError = tReplace('validation.minLength', { '0': '5' });
  // If translation is 'Must be at least {0} characters'
  // Result: 'Must be at least 5 characters'

  // For validation
  function validateMinLength(value: string, min: number): string | null {
    if (value.length < min) {
      return tReplace('validation.minLength', { '0': min.toString() });
    }
    return null;
  }
</script>
`;

// =============================================================================
// EXAMPLE 6: Store Subscription Pattern (Advanced)
// =============================================================================

/**
 * ADVANCED PATTERN: Reactive Language Switching with Store
 *
 * When to use:
 * - Component needs to react to language changes in real-time
 * - Storing computed translations
 * - Complex components with derived state based on language
 *
 * When NOT to use:
 * - Simple template strings (just use t() directly)
 * - One-time translations in event handlers
 * - Most components (direct t() is simpler)
 */
const PATTERN_STORE_SUBSCRIPTION = `
<script lang="ts">
  import { i18n } from '$lib/features/localization';  // ✅ Import the store
  
  // Subscribe to the store - updates when language changes
  let currentLang = \$derived(i18n.getLanguage());
  
  // ✅ For real-time reactive translations, use derived stores
  let translations = \$derived.by(() => ({
    title: i18n.t('orders.title'),
    noOrders: i18n.t('orders.noOrders'),
    loading: i18n.t('common.loading'),
  }));

  // Or subscribe to get state snapshots
  let state = \$derived(\$i18n);
  
  // Access current language
  let lang = \$derived.by(() => {
    if (currentLang === 'da') {
      return 'dansk';
    } else {
      return 'english';
    }
  });
</script>

<!-- Use derived translations -->
<h1>{translations.title}</h1>
{#if loading}
  <p>{translations.loading}</p>
{:else}
  <p>{translations.noOrders}</p>
{/if}
`;

/**
 * ADVANCED PATTERN: Language Switcher Component
 *
 * Shows how to implement a language switcher that changes the global language
 */
const PATTERN_LANGUAGE_SWITCHER = `
<script lang="ts">
  import { i18n, getSupportedLanguage, type Language } from '$lib/features/localization';
  import Button from '$lib/components/atoms/Button.svelte';

  // Get current language
  let currentLanguage = \$derived(i18n.getLanguage());

  // Available languages
  const languages: Array<{ code: Language; label: string }> = [
    { code: 'da', label: 'Dansk' },
    { code: 'en', label: 'English' }
  ];

  // Handle language change
  function switchLanguage(lang: Language) {
    i18n.setLanguage(lang);
    // Language is now updated globally
  }
</script>

<div class="flex gap-2">
  {#each languages as lang}
    <Button
      variant={currentLanguage === lang.code ? 'primary' : 'secondary'}
      onclick={() => switchLanguage(lang.code)}
    >
      {lang.label}
    </Button>
  {/each}
</div>
`;

// =============================================================================
// IMPLEMENTATION CHECKLIST
// =============================================================================

/**
 * Quick Reference: When Refactoring Components
 *
 * BEFORE YOU START:
 * ☐ Ensure translations.ts has all needed keys
 * ☐ Review example patterns above for your use case
 * ☐ Check if validation messages need parameterization
 * ☐ Identify all hardcoded strings (user-facing)
 *
 * DURING REFACTORING:
 * ☐ Import { t } from '$lib/features/localization'
 * ☐ Replace hardcoded strings with t('key.name')
 * ☐ Test with both languages (da and en)
 * ☐ Update translations.ts if new keys are needed
 * ☐ Keep aria-labels and titles in translations
 * ☐ Use validation helpers for form errors
 *
 * AFTER REFACTORING:
 * ☐ Test language switching works
 * ☐ Verify all translations are present
 * ☐ Check for any hardcoded strings you missed
 * ☐ Test responsive layout with different text lengths
 * ☐ Run type-checking (no missing translation keys)
 * ☐ Test with screen reader for accessibility
 *
 * COMMON MISTAKES TO AVOID:
 * ✗ Storing t() result in a variable (will not update on language change)
 *   ✓ Call t() fresh each time or use derived/computed
 * ✗ Forgetting to add new keys to translations.ts
 *   ✓ Always add keys to both 'da' and 'en' sections
 * ✗ Using hardcoded strings in development but not translating
 *   ✓ Always refactor strings from the start
 * ✗ Not translating aria-labels and titles
 *   ✓ Include all user-facing text in translations
 * ✗ Creating overly specific translation keys
 *   ✓ Reuse keys across similar contexts (e.g., common.loading)
 */

// =============================================================================
// KEY PRINCIPLES
// =============================================================================

/**
 * PRINCIPLE 1: Simple Direct Usage
 *
 * For 99% of cases, just use t() in templates:
 *   <button>{t('auth.logout')}</button>
 *
 * This is the simplest, most maintainable approach.
 */

/**
 * PRINCIPLE 2: Translation Key Hierarchy
 *
 * Keys are organized by feature/domain:
 *   auth.*           - Authentication UI
 *   orders.*         - Orders feature
 *   products.*       - Products feature
 *   locations.*      - Locations feature
 *   menu.*           - Navigation menu
 *   common.*         - Shared UI elements
 *   validation.*     - Form validation messages
 *   dateTime.*       - Date/time formatting
 *
 * Choose keys that are descriptive and reusable.
 */

/**
 * PRINCIPLE 3: Fallback Behavior
 *
 * If a translation key is missing:
 * 1. Try to find it in the current language (da or en)
 * 2. If not found, fallback to Danish
 * 3. If still not found, return the key itself as fallback
 *
 * This prevents the app from breaking if translations are incomplete.
 */

/**
 * PRINCIPLE 4: Performance Considerations
 *
 * t() is extremely fast:
 * - It's just object property lookup
 * - No DOM operations
 * - Minimal overhead
 *
 * Safe to use liberally throughout components.
 */

/**
 * PRINCIPLE 5: Testing
 *
 * When testing components with translations:
 * - Test with both languages (da and en)
 * - Use t() in test setup to verify translations exist
 * - Mock localStorage for language preference
 * - Verify aria-labels are correctly translated
 */

// =============================================================================
// FINAL SUMMARY
// =============================================================================

/**
 * THE 30-SECOND VERSION:
 *
 * 1. At the top of your component, add:
 *    import { t } from '$lib/features/localization';
 *
 * 2. Replace hardcoded strings with t('key'):
 *    OLD: <button>Log ud</button>
 *    NEW: <button>{t('auth.logout')}</button>
 *
 * 3. For logic (notifications, validation):
 *    OLD: notifications.error('Failed to save')
 *    NEW: notifications.error(t('orders.saveError'))
 *
 * 4. Add any new translation keys to translations.ts
 *    in BOTH the 'da' and 'en' sections
 *
 * 5. Test in both languages to verify it works.
 *
 * That's it! The rest of the system handles the rest.
 */

// Export types for documentation
export type {
  // Reference types - these exist in the actual implementations
  // They're shown here for documentation purposes only
  AuthFormProps,
  OrderCardProps,
  DayViewProps,
  MainLayoutProps
};
