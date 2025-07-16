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

## Build for Production

```sh
bun run build
```