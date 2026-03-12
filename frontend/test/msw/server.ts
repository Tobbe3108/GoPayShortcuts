import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Inline minimal handlers to avoid import-resolution edge-cases during test
// collection (some environments may evaluate modules in an order that makes
// named exports undefined when imported from separate files). Keep handlers
// here simple; expand as needed.
const handlers = [
  rest.get('http://localhost:8787/api/*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: [] }));
  })
];

export const server = setupServer(...handlers);
