# GoPay BAD Edition

## Developing

Instal dependencies with `bun i`, start a development server:

```bash
bun dev (then manually open the at http://localhost:5173/)

bun dev -- --open (will automatically open the browser)
```

## Building

To create a production version of your app:

```bash
bun build
```

You can preview the production build with `bun preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
