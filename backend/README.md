# Backend (Cloudflare Worker)

TypeScript Cloudflare Worker providing API endpoints for GoPay Shortcuts. Integrates with GoPay/Meyers, handles authentication, orders, products, and more.

## Features

- TypeScript, ES modules, idiomatic Cloudflare Worker
- Secure, fast, scalable
- Integrates with GoPay and Meyers APIs
- Endpoints for login, OTP, locations, menu, orders, products
- Error handling, logging, and security best practices

## Development

```sh
npm install
npx wrangler dev
```

## Deployment

```sh
npx wrangler publish
```

## Configuration

- See `wrangler.jsonc` for bindings and environment variables

## License

See [../LICENSE](../LICENSE)
