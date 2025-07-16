import { protectRoute } from '$lib/utils/protectedRoute';

export function load() {
	// The route is protected - only authenticated users can access it
	protectRoute();

	return {};
}
