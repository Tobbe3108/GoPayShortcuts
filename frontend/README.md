# Frontend (Svelte + Tailwind)

A static Svelte webapp providing shortcuts to features from a bad food ordering app. Lightweight, responsive, and easy to use.

## Features

- Svelte + TypeScript
- Tailwind CSS for all styling
- Responsive design (mobile & desktop)
- Shared state via Svelte stores
- Atomic design component architecture

## Component Architecture

The application follows atomic design principles with components organized as:

- **Atoms**: Basic building blocks (Button, Input, Label, Card)
- **Molecules**: Simple groups of UI elements (FormField)
- **Organisms**: Complex UI components (AuthForm)
- **Templates**: Page layouts (LoginLayout, MainLayout)
- **Pages**: Specific instances of templates with real content

## Development

```sh
bun install
bun run dev
```

## Environment Variables

The application uses environment variables for configuration. These are set up in the `.env` files:

- `.env` - Default environment variables for development
- `.env.production` - Production environment variables

Available environment variables:

| Variable            | Description          | Default (Development)       |
| ------------------- | -------------------- | --------------------------- |
| PUBLIC_API_BASE_URL | Base URL for the API | `http://localhost:8787/api` |

To add new environment variables:

1. Add the variable to the appropriate `.env` file(s)
2. Import in code using:

   ```typescript
   import { API_VARIABLE } from '$lib/config/environment';
   ```

3. Use the variable in your code

## Build for Production

```sh
bun run build
```
