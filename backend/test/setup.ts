// Backend test setup - Node environment
// IMPORTANT: This setup blocks all real network requests to prevent accidental API calls

import { vi, beforeAll, afterEach } from 'vitest';

// =============================================================================
// NETWORK BLOCKING - Prevent any real HTTP requests during tests
// =============================================================================

const blockedFetch = () => {
	throw new Error(
		'[TEST ISOLATION ERROR] Real fetch() calls are blocked in tests!\n' +
			'Use vi.mock() to mock your API client or vi.spyOn(global, "fetch") for specific tests.'
	);
};

// Block global fetch
beforeAll(() => {
	vi.stubGlobal('fetch', blockedFetch);
});

// Reset mocks after each test
afterEach(() => {
    vi.restoreAllMocks();
});

// Provide default stubs used by many backend tests
vi.stubEnv('GOPAY_API_URL', 'https://gopay.example');
vi.stubEnv('MEYERS_API_URL', 'https://meyers.example');


// =============================================================================
// Environment Setup
// =============================================================================

// Ensure we're in test environment
vi.stubEnv('NODE_ENV', 'test');

// Clear any API keys/secrets that might leak into tests
vi.stubEnv('GOPAY_API_KEY', '');
vi.stubEnv('GOPAY_API_SECRET', '');
vi.stubEnv('MEYERS_API_KEY', '');
