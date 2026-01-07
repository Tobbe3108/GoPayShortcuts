<script lang="ts">
	import '../app.css';
	import { authStore } from '$lib/features/auth/store';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import Notifications from '$lib/core/notifications/organisms/Notifications.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { register, init, locale, _, getLocaleFromNavigator, isLoading } from 'svelte-i18n';

	// Register locales
	register('en', () => import('$lib/i18n/en.json'));
	register('da', () => import('$lib/i18n/da.json'));

	// Initialize i18n
	init({
		fallbackLocale: 'da',
		initialLocale: getLocaleFromNavigator() || 'da'
	});
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	$effect(() => {
		document.documentElement.lang = $locale || 'da';
	});
</script>

<div class="min-h-screen bg-muted">
	{#if ($authStore.isLoading && page.url.pathname !== base + '/login') || $isLoading}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-slate-600">{$_('auth.login.validatingSession')}</p>
			</div>
		</div>
	{:else}
		{@render children?.()}
	{/if}
	<Notifications />
</div>
