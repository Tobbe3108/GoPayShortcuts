import { protectRoute } from '$lib/core/auth/protectedRoute';

export function load() {
	protectRoute();
	return {};
}
