import { protectRoute } from '../core/auth/protectedRoute';

export function load() {
	protectRoute();
	return {};
}
