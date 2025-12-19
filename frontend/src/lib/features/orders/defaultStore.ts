import type { SimplifiedOrder } from './models/SimplifiedOrder';
// no external date formatting required for global default

const GLOBAL_KEY = 'gops:defaultOrder';

export interface DefaultOrderRecord extends SimplifiedOrder {
	id: string;
	createdAt: string;
	updatedAt: string;
	version: string;
}

function key() {
	return GLOBAL_KEY;
}

function nowIso() {
	return new Date().toISOString();
}

export const defaultStore = {
	// Note: this implementation stores a single global default used for any day.
	// The optional `date` parameter is ignored but kept for API compatibility.
	getDefault: async (): Promise<DefaultOrderRecord | null> => {
		try {
			const raw = localStorage.getItem(key());
			if (!raw) return null;
			const parsed = JSON.parse(raw) as DefaultOrderRecord;
			return parsed;
		} catch (err) {
			// LocalStorage might be unavailable (privacy mode) or JSON parse fail
			console.error('defaultStore.getDefault failed', err);
			return null;
		}
	},

	saveDefault: async (order: SimplifiedOrder): Promise<DefaultOrderRecord> => {
		if (!order || !order.date) throw new Error('Invalid order');
		if (!order.orderlines || order.orderlines.length === 0)
			throw new Error('Cannot save empty order as default');

		const record: DefaultOrderRecord = {
			...order,
			// Use a global id to indicate stored default; include kitchen to allow multiple kitchens if desired in future
			id: `global:${order.kitchenId}`,
			createdAt: nowIso(),
			updatedAt: nowIso(),
			version: nowIso()
		};

		try {
			localStorage.setItem(key(), JSON.stringify(record));
		} catch (err) {
			console.error('defaultStore.saveDefault failed', err);
			throw err;
		}

		return record;
	},

	// Deletes the global default
	deleteDefault: async (): Promise<void> => {
		try {
			localStorage.removeItem(key());
		} catch (err) {
			console.error('defaultStore.deleteDefault failed', err);
		}
	}
};

export default defaultStore;
