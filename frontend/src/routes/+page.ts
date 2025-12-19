import { protectRoute } from '$lib/features/auth/protectedRoute';

export function load() {
	protectRoute();
	return {};
}
