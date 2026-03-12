Integration tests added to the backend validate the GoPayClient mock behavior and shared helpers.

Run backend unit tests with:

  npm --prefix backend test

Files added/updated:
  - backend/src/endpoints/Shared/*.edge.spec.ts  (edge-case tests)
  - backend/src/goPay/client.mock.spec.ts        (mock integration tests)

This README is intentionally small to help other devs find the new tests quickly.
