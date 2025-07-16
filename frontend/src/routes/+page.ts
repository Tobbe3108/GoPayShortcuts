import { protectRoute } from '$lib/utils/protectedRoute';

export function load() {
	protectRoute();
	return {};
}
