import { protectRoute } from '$lib/auth/protectedRoute';

export function load() {
	protectRoute();
	return {};
}
