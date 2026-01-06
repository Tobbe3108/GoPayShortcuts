---
description: Scaffolds new feature module - creates directory structure with models, components, services, store
---

## Purpose

Quickly bootstrap a new feature module in the frontend application with a consistent directory structure. This command creates all the necessary files and folders for a complete feature including components, services, state management, and data models.

## What It Does

1. Creates a new feature directory under `frontend/src/lib/features/`
2. Generates subdirectories for organizing feature code:
   - `components/` - Svelte components for the feature
   - `services/` - API calls and business logic
   - `store/` - Svelte store for state management
   - `models/` - TypeScript types and interfaces
3. Creates template files with boilerplate code
4. Follows GoPayShortcuts project conventions and patterns

## Usage Examples

```bash
# Create a new feature named "transactions"
mkdir -p frontend/src/lib/features/transactions/{components,services,store,models}

# Create feature with TypeScript interfaces
cat > frontend/src/lib/features/transactions/models/Transaction.ts << 'EOF'
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
}
EOF

# Create feature store
cat > frontend/src/lib/features/transactions/store/transactionStore.ts << 'EOF'
import { writable } from 'svelte/store';
import type { Transaction } from '../models/Transaction';

export const transactions = writable<Transaction[]>([]);
EOF

# Create feature service
cat > frontend/src/lib/features/transactions/services/transactionService.ts << 'EOF'
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { Transaction } from '../models/Transaction';

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${PUBLIC_API_BASE_URL}/transactions`);
  return response.json();
}
EOF
```

## Related Skills

- [SvelteKit Structure](../../skill/sveltekit-structure.md) - Project directory organization
- [Svelte Components](../../skill/svelte-components.md) - Creating reusable UI components
- [Svelte Stores](../../skill/svelte-stores.md) - State management patterns
- [TypeScript Types](../../skill/typescript-types.md) - Type definitions and interfaces
- [Feature-based Architecture](../../skill/feature-architecture.md) - Organizing code by features
