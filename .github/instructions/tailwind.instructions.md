================
CODE SNIPPETS
================
TITLE: Basic HTML structure with Tailwind CSS classes
DESCRIPTION: This HTML example demonstrates a basic page setup, including the necessary meta tags and a link to the compiled CSS file. It also shows a heading styled with Tailwind's utility classes like `text-3xl`, `font-bold`, and `underline`.

SOURCE: https://tailwindcss.com/docs/installation/using-postcss

LANGUAGE: HTML
CODE:

```
<!doctype html><html><head>  <meta charset="UTF-8">  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <link href="/dist/styles.css" rel="stylesheet"></head><body>  <h1 class="text-3xl font-bold underline">    Hello world!  </h1></body></html>
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies via npm
DESCRIPTION: This command installs the necessary packages: `tailwindcss`, `@tailwindcss/postcss`, and `postcss` using npm. These are fundamental for integrating Tailwind CSS as a PostCSS plugin in your project.

SOURCE: https://tailwindcss.com/docs/installation/using-postcss

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss
```

---

TITLE: Example HTML structure using Tailwind CSS classes
DESCRIPTION: A basic HTML document demonstrating how to link your compiled CSS file and apply Tailwind's utility classes to elements. Ensure your framework correctly includes the compiled stylesheet in the `<head>`.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: HTML
CODE:

```
<!doctype html><html><head>  <meta charset="UTF-8">  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <link href="/src/style.css" rel="stylesheet"></head><body>  <h1 class="text-3xl font-bold underline">    Hello world!  </h1></body></html>
```

---

TITLE: Start your development build process
DESCRIPTION: This command initiates your project's development build process, typically defined in your `package.json` scripts. It compiles your CSS, including Tailwind styles, and often starts a local development server.

SOURCE: https://tailwindcss.com/docs/installation/using-postcss

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start Qwik development server
DESCRIPTION: Executes the `npm run dev` command to start the development server, which builds and serves the Qwik application, enabling live preview and hot module reloading.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: bash
CODE:

```
npm run dev
```

---

TITLE: Install Tailwind CSS and CLI via npm
DESCRIPTION: This command installs the core `tailwindcss` package along with the `@tailwindcss/cli` tool using npm. These packages are fundamental for leveraging the Tailwind CLI to process your CSS and generate utility classes.

SOURCE: https://tailwindcss.com/docs/installation/tailwind-cli

LANGUAGE: Terminal
CODE:

```
npm install tailwindcss @tailwindcss/cli
```

---

TITLE: Start SvelteKit Development Server
DESCRIPTION: Executes the `npm run dev` command to start the SvelteKit development server. This allows developers to preview their application and utilize live reloading during development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start the Vite development server
DESCRIPTION: Run the development server using `npm run dev`. This command compiles your assets, watches for changes, and serves your application locally, allowing you to see your Tailwind CSS styles in action.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start the Tailwind CLI build process with watch mode
DESCRIPTION: Execute this command to initiate the Tailwind CSS build. It scans your specified input CSS file (`./src/input.css`) and any linked HTML/JS files for Tailwind classes, then generates the final CSS output to `./src/output.css`. The `--watch` flag enables continuous rebuilding whenever source files change.

SOURCE: https://tailwindcss.com/docs/installation/tailwind-cli

LANGUAGE: Terminal
CODE:

```
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

---

TITLE: Start Ember.js development server
DESCRIPTION: Runs the `npm run start` command to initiate the Ember.js build process and start the development server. This allows you to view your application in a web browser and see the applied Tailwind CSS styles.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: Terminal
CODE:

```
npm run start
```

---

TITLE: Install Tailwind CSS and Vite plugin via npm
DESCRIPTION: Install the necessary `tailwindcss` and `@tailwindcss/vite` packages using npm. These packages are essential for integrating Tailwind CSS with your Vite build process.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Start Astro development server
DESCRIPTION: Executes the `npm run dev` command to start the Astro development server, allowing you to preview your project and see Tailwind CSS styles applied in real-time.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Create a new Vite project
DESCRIPTION: Initialize a new Vite project using `npm create vite@latest` and navigate into the project directory. This command sets up the basic project structure.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: Shell
CODE:

```
npm create vite@latest my-project
cd my-project
```

---

TITLE: Integrate compiled Tailwind CSS and use utility classes in HTML
DESCRIPTION: This HTML snippet demonstrates how to link the compiled `output.css` file in your document's `<head>` section. It also provides a basic example of applying Tailwind's utility classes (e.g., `text-3xl`, `font-bold`, `underline`) directly to an HTML element to style content.

SOURCE: https://tailwindcss.com/docs/installation/tailwind-cli

LANGUAGE: HTML
CODE:

```
<!doctype html><html><head>  <meta charset="UTF-8">  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <link href="./output.css" rel="stylesheet"></head><body>  <h1 class="text-3xl font-bold underline">    Hello world!  </h1></body></html>
```

---

TITLE: Start Phoenix development server
DESCRIPTION: Run the `mix phx.server` command to start the Phoenix development server. This command also initiates the asset build process, including the compilation of your Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Shell
CODE:

```
mix phx.server
```

---

TITLE: Start Development Server
DESCRIPTION: Executes the `npm run dev` command, which typically starts the development server configured by Vite, enabling live reloading and local preview of the application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: shell
CODE:

```
npm run dev
```

---

TITLE: Start Gatsby development server
DESCRIPTION: Runs the `gatsby develop` command to start the local development server. This compiles the project and provides a live-reloading environment for development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: bash
CODE:

```
gatsby develop
```

---

TITLE: Start the Next.js development server
DESCRIPTION: This command initiates the Next.js development server, which compiles your project and provides a live-reloading environment for local development and testing.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start Rspack Development Server
DESCRIPTION: Execute the `npm run dev` command to start the Rspack development server. This compiles your project, applies Tailwind CSS, and provides a live-reloading environment for development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Create a new Nuxt project
DESCRIPTION: Start by creating a new Nuxt project using `create-nuxt` if you don’t have one set up already. This command initializes a new Nuxt application and navigates into its directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: Shell
CODE:

```
npm create nuxt my-project
cd my-project
```

---

TITLE: Import Tailwind CSS into your main CSS file
DESCRIPTION: Add this `@import` statement to your project's main CSS file (e.g., `src/input.css`). This line tells Tailwind to inject its base styles, components, and utility classes into your stylesheet during the build process.

SOURCE: https://tailwindcss.com/docs/installation/tailwind-cli

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Start Nuxt development server
DESCRIPTION: Run the development server using `npm run dev`. This command starts your Nuxt application, allowing you to see the changes and use Tailwind CSS for styling.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Create a new Qwik project
DESCRIPTION: Initializes a new Qwik project using `create-qwik` and navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: bash
CODE:

```
npm create qwik@latest empty my-project
cd my-project
```

---

TITLE: Start the development build process
DESCRIPTION: Initiates the development server using `npm run dev`, which compiles the SolidJS application with Tailwind CSS. This command provides live reloading, allowing developers to see changes instantly.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start the Meteor project build process
DESCRIPTION: This command initiates the development server and build process for the Meteor application. It allows for real-time compilation and serving of the project, enabling live development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: Shell
CODE:

```
npm run start
```

---

TITLE: Add Tailwind CSS PostCSS plugin to configuration
DESCRIPTION: This configuration snippet for `postcss.config.mjs` (or your PostCSS configuration file) adds the `@tailwindcss/postcss` plugin to your PostCSS setup. This enables PostCSS to correctly process and compile Tailwind CSS directives.

SOURCE: https://tailwindcss.com/docs/installation/using-postcss

LANGUAGE: JavaScript
CODE:

```
export default {  plugins: {    "@tailwindcss/postcss": {},  }}
```

---

TITLE: Create SvelteKit Project
DESCRIPTION: Initializes a new SvelteKit project using the `npx sv create` command and then navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: Shell
CODE:

```
npx sv create my-project
cd my-project
```

---

TITLE: Integrate Tailwind CSS Play CDN in HTML
DESCRIPTION: This example demonstrates how to include the Tailwind CSS Play CDN script in the <head> section of an HTML file. This setup allows for immediate use of Tailwind's utility classes for development purposes without a build step.

SOURCE: https://tailwindcss.com/docs/installation/play-cdn

LANGUAGE: HTML
CODE:

```
<!doctype html><html>  <head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  </body></html>
```

---

TITLE: Start Rspack Development Server
DESCRIPTION: Initiates the Rspack development server, compiling and serving the project, typically with hot-reloading capabilities.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Start Parcel build process
DESCRIPTION: This command initiates Parcel's development server and build process, compiling the index.html file and its dependencies. It allows for live reloading and development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: bash
CODE:

```
npx parcel src/index.html
```

---

TITLE: Create a New Rspack Project
DESCRIPTION: Initializes a new Rspack project using the Rspack CLI, providing a foundational setup for development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: Shell
CODE:

```
npm create rspack@latest
```

---

TITLE: Start the development build process
DESCRIPTION: Run the development build command to compile your assets, including Tailwind CSS. This command typically watches for file changes and rebuilds automatically during development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: bash
CODE:

```
npm run dev
```

---

TITLE: Create a new Laravel project
DESCRIPTION: Initiate a new Laravel project using the Laravel installer command. This command sets up the basic project structure and navigates into the new directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: bash
CODE:

```
laravel new my-project
cd my-project
```

---

TITLE: Create a new Ruby on Rails project
DESCRIPTION: Initializes a new Ruby on Rails application with a specified name and then navigates into the newly created project directory. This command is typically the first step when starting a new Rails development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/ruby-on-rails

LANGUAGE: Shell
CODE:

```
rails new my-project
cd my-project
```

---

TITLE: Create a new Phoenix project
DESCRIPTION: Instructions to initialize a new Phoenix project using the `mix phx.new` command and then navigate into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Shell
CODE:

```
mix phx.new myproject
cd myproject
```

---

TITLE: Start Angular development server
DESCRIPTION: Runs the Angular development server using `ng serve`. This command compiles your application, serves it locally, and enables live reloading, allowing you to see changes as you develop.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: bash
CODE:

```
ng serve
```

---

TITLE: Create a new Astro project
DESCRIPTION: Initializes a new Astro project using the `create astro` command and navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: Shell
CODE:

```
npm create astro@latest my-project
cd my-project
```

---

TITLE: Start the development build process
DESCRIPTION: Executes the `npm run dev` command to initiate the development server and asset build process. This command compiles all project assets, including the Tailwind CSS, for local development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: Shell
CODE:

```
npm run dev
```

---

TITLE: Initialize a new Parcel project
DESCRIPTION: This step outlines how to set up a new Parcel project from scratch, including creating directories and initializing npm. It prepares the environment for installing Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: bash
CODE:

```
mkdir my-project
cd my-project
npm init -y
npm install parcel
mkdir src
touch src/index.html
```

---

TITLE: Install Tailwind CSS and Vite plugin for Qwik
DESCRIPTION: Installs the core `tailwindcss` package and the `@tailwindcss/vite` plugin, along with their necessary peer dependencies, using npm.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: bash
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Start Laravel Mix build process with npm
DESCRIPTION: This command initiates the Laravel Mix build process, typically in watch mode, to compile assets including Tailwind CSS. It continuously monitors for changes and rebuilds the project as needed during development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/mix

LANGUAGE: bash
CODE:

```
npm run watch
```

---

TITLE: Start Webpack Encore build process
DESCRIPTION: Initiates the Webpack Encore build process in watch mode by running `npm run watch`. This command compiles your assets, including Tailwind CSS, and automatically rebuilds them whenever changes are detected in your source files.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: Shell
CODE:

```
npm run watch
```

---

TITLE: Install Tailwind CSS CLI
DESCRIPTION: Execute the `mix tailwind.install` command to download and set up the standalone Tailwind CSS command-line interface (CLI) executable within your project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Shell
CODE:

```
mix tailwind.install
```

---

TITLE: Create a new Symfony project
DESCRIPTION: Initializes a new Symfony web application using the Symfony Installer and navigates into the newly created project directory. This is the foundational step before integrating front-end tools.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: Shell
CODE:

```
symfony new --webapp my-project
cd my-project
```

---

TITLE: Import Tailwind CSS into your main CSS file
DESCRIPTION: This `@import` rule should be added to your main CSS file (e.g., `src/index.css`). It instructs PostCSS to include Tailwind's base styles, components, and utility classes into your final compiled CSS.

SOURCE: https://tailwindcss.com/docs/installation/using-postcss

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Start the development build process for Ruby on Rails
DESCRIPTION: Initiates the development server and asset compilation process for the Ruby on Rails application. This command typically watches for file changes and rebuilds assets, including Tailwind CSS, ensuring that styles are applied correctly during development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/ruby-on-rails

LANGUAGE: Shell
CODE:

```
./bin/dev
```

---

TITLE: Create a new AdonisJS project
DESCRIPTION: Initializes a new AdonisJS project using the `create adonisjs` command with the `web` kit and then navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: Shell
CODE:

```
npm init adonisjs@latest my-project -- --kit=web
cd my-project
```

---

TITLE: Apply Responsive place-content Utilities in Tailwind CSS Grid
DESCRIPTION: This example demonstrates how to apply `place-content` utilities to a grid container, including using responsive variants. It shows how to initially align content to the start of the block axis and then center it on medium screen sizes and above, showcasing adaptive layout behavior.

SOURCE: https://tailwindcss.com/docs/place-content

LANGUAGE: HTML
CODE:

```
<div class="grid place-content-start md:place-content-center ...">  <!-- ... --></div>
```

---

TITLE: Import Tailwind CSS into your main CSS file
DESCRIPTION: Add the `@import "tailwindcss";` directive to your primary CSS file. This line imports all of Tailwind's base styles, components, and utilities.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Create a new SolidJS project using Vite
DESCRIPTION: Initializes a new SolidJS project with the Vite template using `npx degit`. This command sets up the basic project structure and navigates into the newly created directory, preparing it for further development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: Shell
CODE:

```
npx degit solidjs/templates/js my-project
cd my-project
```

---

TITLE: Install Tailwind CSS and Vite Plugin
DESCRIPTION: Installs the core `tailwindcss` package and its SvelteKit-specific Vite plugin, `@tailwindcss/vite`, as development dependencies using npm.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Create React Router Project
DESCRIPTION: Initializes a new React Router project using the `create-react-router` command-line tool and then navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: shell
CODE:

```
npx create-react-router@latest my-project
cd my-project
```

---

TITLE: Install Tailwind CSS gems for Ruby on Rails
DESCRIPTION: Adds the `tailwindcss-ruby` and `tailwindcss-rails` gems to the project's Gemfile, making them available for use. Following the gem installation, the `tailwindcss:install` command is executed to set up the necessary configuration files and assets for Tailwind CSS within the Rails application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/ruby-on-rails

LANGUAGE: Shell
CODE:

```
./bin/bundle add tailwindcss-ruby
./bin/bundle add tailwindcss-rails
./bin/rails tailwindcss:install
```

---

TITLE: Configure Tailwind CSS Vite plugin in vite.config.ts
DESCRIPTION: Add the `@tailwindcss/vite` plugin to your Vite configuration file (`vite.config.ts`). This step ensures that Tailwind CSS is processed correctly by Vite during development and build.

SOURCE: https://tailwindcss.com/docs/index

LANGUAGE: TypeScript
CODE:

```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

---

TITLE: Tailwind CSS mask-composite Responsive Example
DESCRIPTION: This example demonstrates applying `mask-composite` utilities in HTML. It shows how to use `mask-add` for default behavior and `md:mask-subtract` to apply a different mask composition at medium screen sizes and above, illustrating responsive design with Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/mask-composite

LANGUAGE: HTML
CODE:

```
<div class="mask-add md:mask-subtract ...">  <!-- ... --></div>
```

---

TITLE: Use Tailwind CSS utility classes in Vue template
DESCRIPTION: Start applying Tailwind's utility classes directly in your Vue components to style your content. This example demonstrates a basic `h1` element styled with Tailwind classes for font size, weight, and text decoration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: Vue
CODE:

```
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
```

---

TITLE: Create a new Ember.js project
DESCRIPTION: Initializes a new Ember.js project using Ember CLI with Embroider and no welcome page, then navigates into the newly created project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: Terminal
CODE:

```
npx ember-cli new my-project --embroider --no-welcome
cd my-project
```

---

TITLE: Create a New Rspack Project
DESCRIPTION: Initiate a new Rspack project using the Rspack CLI. This command sets up the basic project structure, ready for further configuration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: Shell
CODE:

```
npm create rspack@latest
```

---

TITLE: Create a new Next.js project with TypeScript and ESLint
DESCRIPTION: This command initializes a new Next.js application using `create-next-app`, configuring it with TypeScript, ESLint, and the App Router. After creation, it navigates into the new project directory.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: Shell
CODE:

```
npx create-next-app@latest my-project --typescript --eslint --app
cd my-project
```

---

TITLE: Apply Responsive Scroll Snap Alignment with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply responsive scroll snap alignment using Tailwind CSS utilities. The `snap-center` class sets the default alignment, while `md:snap-start` overrides it to `start` for medium screen sizes and above, showcasing the use of breakpoint variants.

SOURCE: https://tailwindcss.com/docs/scroll-snap-align

LANGUAGE: HTML
CODE:

```
<div class="snap-center md:snap-start ...">  <!-- ... --></div>
```

---

TITLE: Install Tailwind CSS and PostCSS Dependencies
DESCRIPTION: Install the core Tailwind CSS package (`tailwindcss`), the PostCSS plugin for Tailwind (`@tailwindcss/postcss`), and their necessary peer dependencies (`postcss`, `postcss-loader`) using npm.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss postcss-loader
```

---

TITLE: Create a new Meteor project using npx
DESCRIPTION: This command initializes a new Meteor application with the specified project name and navigates into its directory, preparing the environment for further development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: Shell
CODE:

```
npx meteor create my-project
cd my-project
```

---

TITLE: Apply Tailwind CSS classes in a SolidJS component
DESCRIPTION: Demonstrates how to use Tailwind's utility classes directly within a SolidJS component's JSX. This example applies text size, font weight, and underline styles to an `<h1>` element, showcasing immediate styling capabilities.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: JavaScript
CODE:

```
export default function App() {  return (    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  )}
```

---

TITLE: Enable Tailwind watcher in Phoenix development
DESCRIPTION: Add the Tailwind watcher to the list of development watchers in your `config/dev.exs` file. This setup automatically recompiles your Tailwind CSS whenever changes are detected during development.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Elixir
CODE:

```
watchers: [
  # Start the esbuild watcher by calling Esbuild.install_and_run(:default, args)
  esbuild: {Esbuild, :install_and_run, [:myproject, ~w(--sourcemap=inline --watch)]},
  tailwind: {Tailwind, :install_and_run, [:myproject, ~w(--watch)]}
]
```

---

TITLE: Install Tailwind CSS and Vite plugin
DESCRIPTION: Installs the necessary npm packages for Tailwind CSS integration with Vite. This includes `tailwindcss` itself and `@tailwindcss/vite`, which is the official plugin for Vite, along with their peer dependencies.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Create a new Gatsby project
DESCRIPTION: Initializes a new Gatsby project using the Gatsby CLI and navigates into the newly created project directory. This is the first step to set up your development environment.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: bash
CODE:

```
gatsby new my-project
cd my-project
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies via npm
DESCRIPTION: This command installs the core `tailwindcss` package, the `@tailwindcss/postcss` plugin, and `postcss` itself as development dependencies required for Tailwind CSS integration in a Next.js project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss
```

---

TITLE: Use Tailwind CSS classes in Phoenix HTML
DESCRIPTION: An example demonstrating how to apply Tailwind's utility classes directly within an HTML element in a Phoenix HEEX template. This shows basic styling for text size, weight, and decoration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: HTML
CODE:

```
<h1 class="text-3xl font-bold underline">  Hello world!</h1>
```

---

TITLE: Install Tailwind CSS and Vite plugin for Laravel
DESCRIPTION: Install the necessary npm packages for Tailwind CSS and its Vite integration. This includes `tailwindcss` and `@tailwindcss/vite` as development dependencies.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: bash
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies
DESCRIPTION: Installs Tailwind CSS, its PostCSS plugin (`@tailwindcss/postcss`), and `postcss-loader` using npm. These packages are crucial for processing Tailwind's utility classes and integrating them into your build pipeline.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss postcss-loader
```

---

TITLE: Import Tailwind CSS into Qwik global stylesheet
DESCRIPTION: Adds an `@import` statement to the project's global CSS file (e.g., `./src/global.css` or `app.css`) to include all Tailwind CSS styles.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: css
CODE:

```
@import "tailwindcss";
```

---

TITLE: Install Tailwind CSS and Vite Plugin
DESCRIPTION: Installs the core `tailwindcss` package and its dedicated Vite plugin (`@tailwindcss/vite`) along with their necessary peer dependencies using npm, preparing the project for Tailwind CSS integration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Install Tailwind CSS and PostCSS with npm
DESCRIPTION: This command installs Tailwind CSS, `@tailwindcss/postcss`, and `postcss` as peer dependencies using npm. These packages are essential for compiling Tailwind CSS in a Laravel project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/mix

LANGUAGE: bash
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss
```

---

TITLE: Import application CSS into Ember app
DESCRIPTION: Modifies the `./app/app.js` file to import the newly created `./app/app.css` file. This ensures that your main application stylesheet, including Tailwind CSS, is loaded and applied when the Ember application starts.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: JavaScript
CODE:

```
import Application from '@ember/application';import Resolver from 'ember-resolver';import loadInitializers from 'ember-load-initializers';import config from 'my-project/config/environment';import 'my-project/app.css';export default class App {  modulePrefix = config.modulePrefix;  podModulePrefix = config.podModulePrefix;  Resolver = Resolver;}loadInitializers(App, config.modulePrefix);
```

---

TITLE: Install Tailwind plugin in Phoenix dependencies
DESCRIPTION: Add the Tailwind plugin to your Phoenix project's dependencies in `mix.exs` and then run `mix deps.get` to fetch and install it. The plugin is configured to run only in the development environment.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Elixir
CODE:

```
defp deps do  [
    # …
    {:tailwind, "~> 0.3", runtime: Mix.env() == :dev},
  ]end
```

---

TITLE: Install Webpack Encore for asset building in Symfony
DESCRIPTION: Removes default Symfony UX bundles that might conflict or are not needed, then installs Webpack Encore along with `symfony/ux-turbo` and `symfony/stimulus-bundle`. Webpack Encore is essential for managing and compiling front-end assets like CSS and JavaScript.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: Shell
CODE:

```
composer remove symfony/ux-turbo symfony/asset-mapper symfony/stimulus-bundle
composer require symfony/webpack-encore-bundle symfony/ux-turbo symfony/stimulus-bundle
```

---

TITLE: Import Global CSS into SvelteKit Layout
DESCRIPTION: Creates a `+layout.svelte` file in the `src/routes` directory and imports the `app.css` stylesheet. This ensures that the global Tailwind CSS styles are applied across all pages in the SvelteKit application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: Svelte
CODE:

```
<script>
  let { children } = $props();
  import "../app.css";
</script>

{@render children()}
```

---

TITLE: Install Tailwind CSS and PostCSS Dependencies
DESCRIPTION: Installs Tailwind CSS, `@tailwindcss/postcss`, and their peer dependencies (`postcss`, `postcss-loader`) required for integrating Tailwind CSS with PostCSS in a Rspack project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss postcss-loader
```

---

TITLE: Update Tailwind CSS v4 Variant Stacking Order
DESCRIPTION: Explains the change in variant stacking order from right-to-left (v3) to left-to-right (v4) to align with CSS syntax. Provides an HTML example demonstrating how to reverse the order of order-sensitive stacked variants for migration.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: HTML
CODE:

```
<ul class="py-4 first:*:pt-0 last:*:pb-0"><ul class="py-4 *:first:pt-0 *:last:pb-0">  <li>One</li>  <li>Two</li>  <li>Three</li></ul>
```

---

TITLE: Import Tailwind CSS into Global Stylesheet
DESCRIPTION: Creates a new `app.css` file within the `src` directory and adds an `@import` rule to pull in Tailwind CSS directives, making its utility classes available globally.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Apply Tailwind CSS place-self utilities responsively in HTML
DESCRIPTION: This example demonstrates how to apply Tailwind CSS `place-self` utilities, such as `place-self-start` and `place-self-end`, conditionally based on screen size using responsive design variants like `md:`. It shows how to change an item's alignment from start to end on medium screens and above within an HTML div element.

SOURCE: https://tailwindcss.com/docs/place-self

LANGUAGE: HTML
CODE:

```
<div class="place-self-start md:place-self-end ...">  <!-- ... --></div>
```

---

TITLE: Sort Tailwind CSS Classes with Prettier Plugin
DESCRIPTION: This example demonstrates the effect of the official Prettier plugin for Tailwind CSS, which automatically reorders utility classes in your HTML markup according to Tailwind's recommended class order. The snippet shows a button element before and after the Prettier plugin has sorted its classes.

SOURCE: https://tailwindcss.com/docs/editor-setup

LANGUAGE: HTML
CODE:

```
<!-- Before --><button class="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">Submit</button><!-- After --><button class="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">Submit</button>
```

---

TITLE: Create a new Angular project using Angular CLI
DESCRIPTION: Initializes a new Angular project with a specified style format (CSS in this case) and navigates into the newly created project directory. This is the foundational step before integrating Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: bash
CODE:

```
ng new my-project --style css
cd my-project
```

---

TITLE: Include compiled CSS and use Tailwind classes in Twig
DESCRIPTION: Demonstrates how to include the compiled CSS from Webpack Encore in a Symfony Twig template using `encore_entry_link_tags('app')`. It also shows a basic example of applying Tailwind's utility classes to an HTML element.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: HTML
CODE:

```
<!doctype html><html>  <head>    <meta charset="utf-8" />    <meta      name="viewport"      content="width=device-width, initial-scale=1.0"    />    {% block stylesheets %}      {{ encore_entry_link_tags('app') }}    {% endblock %}  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  </body></html>
```

---

TITLE: Apply Responsive justify-items Utilities in HTML
DESCRIPTION: This example demonstrates how to apply `justify-items` utilities responsively using Tailwind CSS. It shows how to set `justify-items-start` by default and `justify-items-center` for medium screen sizes and above, illustrating the use of breakpoint variants for adaptive layouts.

SOURCE: https://tailwindcss.com/docs/justify-items

LANGUAGE: HTML
CODE:

```
<div class="grid justify-items-start md:justify-items-center ...">  <!-- ... --></div>
```

---

TITLE: Install Tailwind CSS and Gatsby PostCSS plugin
DESCRIPTION: Installs the core Tailwind CSS package, its PostCSS plugin, the PostCSS processor itself, and the Gatsby plugin for PostCSS. These packages are crucial for integrating Tailwind CSS into a Gatsby build process.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: bash
CODE:

```
npm install @tailwindcss/postcss tailwindcss postcss gatsby-plugin-postcss
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies via npm
DESCRIPTION: Installs the core `tailwindcss` package along with `@tailwindcss/postcss` and `postcss` as project dependencies using npm. The `--force` flag is used to resolve potential peer dependency conflicts during installation.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: bash
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss --force
```

---

TITLE: Apply Tailwind CSS classes in Ember template
DESCRIPTION: Demonstrates how to use Tailwind's utility classes directly within an Ember.js Handlebars template (`application.hbs`). This example applies `text-3xl`, `font-bold`, and `underline` to an `<h1>` element to style its appearance.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: Handlebars
CODE:

```
{{page-title "MyProject"}}
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
{{outlet}}
```

---

TITLE: Install Tailwind CSS and Vite plugin
DESCRIPTION: Install `@tailwindcss/vite` and its peer dependencies via npm. This command adds the necessary packages to your project for integrating Tailwind CSS with Vite, which Nuxt uses.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Install Tailwind CSS and Vite plugin
DESCRIPTION: Installs the `tailwindcss` package and its Vite plugin (`@tailwindcss/vite`) along with their peer dependencies using npm, which are essential for integrating Tailwind CSS with a Vite-powered AdonisJS project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Use Tailwind CSS Utility Classes in React Component
DESCRIPTION: Demonstrates how to apply Tailwind's utility classes directly within a React component's JSX. This example styles an `<h1>` element with specific font size, weight, and text decoration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: JSX
CODE:

```
export default function App() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}
```

---

TITLE: Configure Vite Plugin for Tailwind CSS
DESCRIPTION: Modifies the `vite.config.ts` file to import and include the `@tailwindcss/vite` plugin in the Vite configuration, enabling Tailwind CSS processing during the build.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: TypeScript
CODE:

```
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
});
```

---

TITLE: Apply Tailwind CSS classes in an HTML ERB template
DESCRIPTION: Demonstrates how to use Tailwind CSS utility classes directly within an HTML ERB file to style an element. The example applies classes for text size (`text-3xl`), font weight (`font-bold`), and text decoration (`underline`) to an `<h1>` tag.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/ruby-on-rails

LANGUAGE: HTML
CODE:

```
<h1 class="text-3xl font-bold underline">  Hello world!</h1>
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies via npm
DESCRIPTION: This command installs Tailwind CSS, its PostCSS plugin, and other necessary PostCSS utilities as project dependencies, enabling Tailwind's styling capabilities within the Meteor application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss postcss-load-config
```

---

TITLE: Install Tailwind CSS and Vite plugin for Astro
DESCRIPTION: Installs the core `tailwindcss` package and its official Vite plugin (`@tailwindcss/vite`) along with their peer dependencies via npm, which are required for Astro integration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: Shell
CODE:

```
npm install tailwindcss @tailwindcss/vite
```

---

TITLE: Configure Tailwind plugin in Phoenix
DESCRIPTION: Configure the Tailwind plugin in your `config/config.exs` file. This configuration specifies the desired Tailwind CSS version and defines the input and output paths for your CSS assets within the Phoenix project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Elixir
CODE:

```
config :tailwind,
  version: "4.1.10",
  myproject: [
    args: ~w(
      --input=assets/css/app.css
      --output=priv/static/assets/app.css
    ),
    cd: Path.expand("..", __DIR__)
  ]
```

---

TITLE: Import Tailwind CSS into main CSS file
DESCRIPTION: Create an `./app/assets/css/main.css` file and add an `@import` rule to include Tailwind CSS. This file will serve as the entry point for Tailwind's styles in your application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Apply Tailwind CSS nth-last-child variant
DESCRIPTION: Styles an element at a specific position counting from the end among its siblings. This example applies margins to specific or patterned anchor tags, starting from the last one.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mx-2 nth-last-3:mx-6 nth-last-[3n+1]:mx-7 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Apply Tailwind CSS classes in a React component
DESCRIPTION: Demonstrates how to use Tailwind's utility classes directly within a React component's `className` attribute. This example applies text size, font weight, and underline styles to an `<h1>` element.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: javascript
CODE:

```
export default function IndexPage() {  return (    <Layout>      <h1 className="text-3xl font-bold underline">        Hello world!      </h1>    </Layout>  )}
```

---

TITLE: Update Phoenix deployment script for Tailwind
DESCRIPTION: Modify the `assets.deploy` alias in your `mix.exs` file to include the Tailwind CSS build command. This ensures that your CSS is compiled and minified as part of the deployment process.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: Elixir
CODE:

```
defp aliases do  [
    # …
    "assets.deploy": [
      "tailwind myproject --minify",
      "esbuild myproject --minify",
      "phx.digest"
    ]
  ]end
```

---

TITLE: Include compiled CSS and use Tailwind in Blade template
DESCRIPTION: Ensure the compiled CSS is linked in your HTML `<head>` section using Laravel's `@vite` directive. This allows you to start applying Tailwind's utility classes directly in your Blade templates to style content.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: html
CODE:

```
<!doctype html><html>  <head>    <meta charset="utf-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    @vite('resources/css/app.css')  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  </body></html>
```

---

TITLE: Import Tailwind CSS into global stylesheet
DESCRIPTION: Creates a new global CSS file (e.g., `./src/styles/global.css`) and adds an `@import` rule to include the Tailwind CSS base styles, components, and utilities.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Integrate compiled CSS and use Tailwind classes in HTML
DESCRIPTION: Demonstrates how to include the compiled CSS and JavaScript assets using the `@vite` directive within an AdonisJS Edge template. It also provides an example of applying basic Tailwind CSS utility classes (`text-3xl font-bold underline`) to an HTML heading element.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: HTML
CODE:

```
<!doctype html><html>  <head>    <meta charset="utf-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    @vite(['resources/css/app.css', 'resources/js/app.js'])  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  </body></html>
```

---

TITLE: Configure Vite to use Tailwind CSS plugin in Qwik
DESCRIPTION: Adds the `@tailwindcss/vite` plugin to the `plugins` array within the `vite.config.ts` file. This step integrates Tailwind CSS processing into the Vite build pipeline for a Qwik project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: typescript
CODE:

```
import { defineConfig } from 'vite'import { qwikVite } from "@builder.io/qwik/optimizer";import { qwikCity } from "@builder.io/qwik-city/vite";// …import tailwindcss from '@tailwindcss/vite'export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      tailwindcss(),
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
    ],
    // …
  }
})
```

---

TITLE: Configure PostCSS to use the Tailwind CSS plugin
DESCRIPTION: This JavaScript configuration file (`postcss.config.mjs`) sets up PostCSS to include the `@tailwindcss/postcss` plugin, enabling Tailwind CSS processing for your project's styles.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: JavaScript
CODE:

```
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

---

TITLE: Style Placeholder Shown Input with Tailwind CSS `:placeholder-shown` Variant
DESCRIPTION: Demonstrates how to style an HTML input element when its placeholder text is visible, using the Tailwind CSS `:placeholder-shown` variant. This can be used to apply different styling before the user starts typing, for example, to change the border color.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<input class="placeholder-shown:border-gray-500 ..." placeholder="you@example.com" />
```

---

TITLE: Apply Tailwind CSS classes with a custom prefix in HTML
DESCRIPTION: Demonstrates how to use a custom prefix (e.g., `tw:`) with Tailwind CSS utility classes directly in HTML elements.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: html
CODE:

```
<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600">  <!-- ... --></div>
```

---

TITLE: Apply responsive box-sizing with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `box-sizing` utilities responsively using Tailwind CSS. By prefixing a utility class with a breakpoint variant like `md:`, the `box-sizing` property will only be applied at the specified screen size and above, allowing for adaptive layouts.

SOURCE: https://tailwindcss.com/docs/box-sizing

LANGUAGE: HTML
CODE:

```
<div class="box-content md:box-border ...">  <!-- ... --></div>
```

---

TITLE: Implement Responsive Gaps with Tailwind CSS Breakpoints
DESCRIPTION: This example illustrates how to apply different gap values based on screen size using responsive variants. For instance, `md:gap-6` sets a larger gap for medium screens and above, enabling adaptive layouts.

SOURCE: https://tailwindcss.com/docs/gap

LANGUAGE: HTML
CODE:

```
<div class="grid gap-4 md:gap-6 ...">  <!-- ... --></div>
```

---

TITLE: Configure Tailwind CSS PostCSS Plugin
DESCRIPTION: Create a `postcss.config.mjs` file at the root of your project. This configuration file registers the `@tailwindcss/postcss` plugin, allowing PostCSS to process and optimize your CSS with Tailwind.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: JavaScript
CODE:

```
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies
DESCRIPTION: Installs `tailwindcss`, `@tailwindcss/postcss`, `postcss`, and `postcss-loader` using npm. These packages are essential for integrating Tailwind CSS with PostCSS in an Ember.js environment.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: Terminal
CODE:

```
npm install tailwindcss @tailwindcss/postcss postcss postcss-loader
```

---

TITLE: Migrate Tailwind CSS v4 Arbitrary Values with CSS Variables
DESCRIPTION: Details the syntax change for using CSS variables as arbitrary values in Tailwind CSS v4. The new syntax uses parentheses instead of square brackets to resolve ambiguity with recent CSS updates. An HTML example illustrates the required syntax update.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: HTML
CODE:

```
<div class="bg-[--brand-color]"></div><div class="bg-(--brand-color)"></div>
```

---

TITLE: Tailwind CSS Grid Auto-Flow Utility Example
DESCRIPTION: This example demonstrates how to apply Tailwind CSS `grid-auto-flow` utilities within an HTML `div` element. It shows the use of `grid-flow-col` for column-based auto-placement and `md:grid-flow-row` to responsively change the auto-flow to row-based on medium screens and above.

SOURCE: https://tailwindcss.com/docs/grid-auto-flow

LANGUAGE: HTML
CODE:

```
<div class="grid grid-flow-col md:grid-flow-row ...">  <!-- ... --></div>
```

---

TITLE: Basic Tailwind CSS break-after Usage
DESCRIPTION: This example demonstrates how to apply `break-after-column` to an element within a multi-column layout to force a column break after it. It shows the basic syntax for controlling content flow.

SOURCE: https://tailwindcss.com/docs/break-after

LANGUAGE: HTML
CODE:

```
<div class="columns-2">  <p>Well, let me tell you something, ...</p>  <p class="break-after-column">Sure, go ahead, laugh...</p>  <p>Maybe we can live without...</p>  <p>Look. If you think this is...</p></div>
```

---

TITLE: Use CSS Variables for Tailwind CSS v4 Theme Values
DESCRIPTION: Recommends using direct CSS variables instead of the `theme()` function for theme values in Tailwind CSS v4, as all theme values are now available as CSS variables. This approach is simpler and can reduce bundle size. A CSS example shows the replacement of `theme()` with `var()`.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
.my-class {  background-color: theme(colors.red.500);  background-color: var(--color-red-500);}
```

---

TITLE: Customize Tailwind CSS Container Utility (v3 to v4)
DESCRIPTION: Tailwind CSS v4 removes the `center` and `padding` configuration options for the `container` utility that were present in v3. To customize the `container` utility in v4, you must now extend it using the `@utility` directive in your CSS. This snippet provides an example of how to add custom `margin-inline` and `padding-inline` to the `container` utility.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

---

TITLE: Install Tailwind CSS and PostCSS dependencies
DESCRIPTION: This command installs Tailwind CSS and its PostCSS plugin as development dependencies using npm. These packages are essential for processing Tailwind CSS in a Parcel project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: bash
CODE:

```
npm install tailwindcss @tailwindcss/postcss
```

---

TITLE: Apply Responsive Tailwind CSS Backdrop Contrast
DESCRIPTION: This example illustrates how to apply different backdrop contrast levels based on screen size using Tailwind CSS's responsive prefixes. The `md:` variant ensures the utility applies from medium screens upwards.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-contrast

LANGUAGE: HTML
CODE:

```
<div class="backdrop-contrast-125 md:backdrop-contrast-150 ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS place-items utilities responsively
DESCRIPTION: This example demonstrates how to apply `place-items` utilities conditionally based on screen size using Tailwind CSS responsive variants. The `place-items-start` class is applied by default, and `md:place-items-center` overrides it for medium screens and above, centering items within their grid areas.

SOURCE: https://tailwindcss.com/docs/place-items

LANGUAGE: HTML
CODE:

```
<div class="grid place-items-start md:place-items-center ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS classes in an Astro component
DESCRIPTION: Demonstrates how to import the global CSS file into an Astro component's frontmatter and then apply Tailwind CSS utility classes directly to HTML elements for styling.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: Astro
CODE:

```
---import "../styles/global.css";---
<h1 class="text-3xl font-bold underline">
  Hello world!</h1>
```

---

TITLE: Tailwind CSS Border Start Color Examples
DESCRIPTION: A comprehensive collection of Tailwind CSS utility classes that set the `border-inline-start-color` property to various shades of violet, purple, fuchsia, pink, and rose. Each entry demonstrates a specific Tailwind class and its corresponding generated CSS, including the color variable and its Oklch representation.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-violet-900 */
border-inline-start-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-violet-950 */
border-inline-start-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-50 */
border-inline-start-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-100 */
border-inline-start-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-200 */
border-inline-start-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-300 */
border-inline-start-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-400 */
border-inline-start-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-500 */
border-inline-start-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-600 */
border-inline-start-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-700 */
border-inline-start-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-800 */
border-inline-start-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-900 */
border-inline-start-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-purple-950 */
border-inline-start-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-50 */
border-inline-start-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-100 */
border-inline-start-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-200 */
border-inline-start-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-300 */
border-inline-start-color: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-400 */
border-inline-start-color: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-500 */
border-inline-start-color: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-600 */
border-inline-start-color: var(--color-fuchsia-600); /* oklch(59.1% 0.293 322.896) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-700 */
border-inline-start-color: var(--color-fuchsia-700); /* oklch(51.8% 0.253 323.949) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-800 */
border-inline-start-color: var(--color-fuchsia-800); /* oklch(45.2% 0.211 324.591) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-900 */
border-inline-start-color: var(--color-fuchsia-900); /* oklch(40.1% 0.17 325.612) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-fuchsia-950 */
border-inline-start-color: var(--color-fuchsia-950); /* oklch(29.3% 0.136 325.661) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-50 */
border-inline-start-color: var(--color-pink-50); /* oklch(97.1% 0.014 343.198) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-100 */
border-inline-start-color: var(--color-pink-100); /* oklch(94.8% 0.028 342.258) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-200 */
border-inline-start-color: var(--color-pink-200); /* oklch(89.9% 0.061 343.231) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-300 */
border-inline-start-color: var(--color-pink-300); /* oklch(82.3% 0.12 346.018) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-400 */
border-inline-start-color: var(--color-pink-400); /* oklch(71.8% 0.202 349.761) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-500 */
border-inline-start-color: var(--color-pink-500); /* oklch(65.6% 0.241 354.308) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-600 */
border-inline-start-color: var(--color-pink-600); /* oklch(59.2% 0.249 0.584) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-700 */
border-inline-start-color: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-800 */
border-inline-start-color: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-900 */
border-inline-start-color: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-pink-950 */
border-inline-start-color: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-50 */
border-inline-start-color: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-100 */
border-inline-start-color: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-200 */
border-inline-start-color: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-300 */
border-inline-start-color: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-400 */
border-inline-start-color: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-500 */
border-inline-start-color: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-600 */
border-inline-start-color: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-700 */
border-inline-start-color: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-800 */
border-inline-start-color: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
```

LANGUAGE: css
CODE:

```
/* Tailwind: border-s-rose-900 */
border-inline-start-color: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
```

---

TITLE: Import Tailwind CSS styles and configure source scanning
DESCRIPTION: Imports Tailwind CSS into the `app.css` file and instructs Tailwind to scan the `resources/views` directory for utility classes. This ensures that Tailwind generates only the necessary styles based on the classes used in the project's templates.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";@source "../views";
```

---

TITLE: Import Tailwind CSS in global.css
DESCRIPTION: Creates a new CSS file, typically `./src/styles/global.css`, and imports the Tailwind CSS directives. This makes all of Tailwind's utility classes available for use throughout the project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: css
CODE:

```
@import "tailwindcss";
```

---

TITLE: Define custom Tailwind CSS utilities with @layer and @utility
DESCRIPTION: Compares defining custom utilities using the v3 `@layer utilities` and the new v4 `@utility` API for creating custom CSS classes.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@layer utilities {  .tab-4 {    tab-size: 4;  }}@utility tab-4 {  tab-size: 4;}
```

---

TITLE: Import Tailwind CSS into Main Stylesheet
DESCRIPTION: Adds an `@import` statement to `style.css` to include the core Tailwind CSS styles, making them available for use in the project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Import Tailwind CSS into main stylesheet
DESCRIPTION: Adds an `@import` statement to `src/index.css` to include the Tailwind CSS base styles, components, and utilities. This makes all of Tailwind's classes available for use throughout the SolidJS project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Access Tailwind CSS v4 Theme Values in React with Motion
DESCRIPTION: Illustrates how to use generated CSS variables directly within JavaScript frameworks like React, particularly with libraries such as Motion. This approach simplifies theme value access and significantly reduces bundle size compared to previous methods. A JSX example demonstrates animating with CSS variables.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: JSX
CODE:

```
<motion.div animate={{ backgroundColor: "var(--color-blue-500)" }} />
```

---

TITLE: Define custom Tailwind CSS component utilities with @layer and @utility
DESCRIPTION: Shows how to define custom component-like utilities using the v3 `@layer components` and the v4 `@utility` API, highlighting sorting behavior.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@layer components {  .btn {    border-radius: 0.5rem;    padding: 0.5rem 1rem;    background-color: ButtonFace;  }}@utility btn {  border-radius: 0.5rem;  padding: 0.5rem 1rem;  background-color: ButtonFace;}
```

---

TITLE: Apply Tailwind CSS classes in a Qwik component
DESCRIPTION: Demonstrates how to use Tailwind's utility classes (e.g., `text-3xl`, `font-bold`, `underline`) directly within the `class` attribute of HTML elements inside a Qwik component's JSX to style content.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/qwik

LANGUAGE: tsx
CODE:

```
import { component$ } from '@builder.io/qwik'export default component$(() => {
  return (
    <h1 class="text-3xl font-bold underline">
      Hello World!
    </h1>
  )
})
```

---

TITLE: Apply Responsive Tailwind CSS mix-blend-mode Utilities
DESCRIPTION: This example demonstrates how to apply `mix-blend-mode` utilities in Tailwind CSS, including responsive variants. It shows how to use `mix-blend-multiply` by default and `md:mix-blend-overlay` for medium screens and above to control element blending with the background, allowing for dynamic blending effects based on screen size.

SOURCE: https://tailwindcss.com/docs/mix-blend-mode

LANGUAGE: HTML
CODE:

```
<div class="mix-blend-multiply md:mix-blend-overlay ...">  <!-- ... --></div>
```

---

TITLE: Automated Tailwind CSS v4 Upgrade with npx
DESCRIPTION: Use the `@tailwindcss/upgrade` tool to automate the migration of Tailwind CSS projects from v3 to v4. This tool handles dependencies, configuration, and template file updates, requiring Node.js 20+.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: Terminal
CODE:

```
npx @tailwindcss/upgrade
```

---

TITLE: Configure Tailwind CSS Vite plugin
DESCRIPTION: Add the `@tailwindcss/vite` plugin to your `vite.config.ts` file. This step ensures that Vite processes Tailwind CSS correctly during the build process.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: typescript
CODE:

```
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // …
  ],
})
```

---

TITLE: Retrieve Tailwind CSS v4 Theme Values in JavaScript using getComputedStyle
DESCRIPTION: Provides a method to access resolved CSS variable values from the document root directly in JavaScript. This is useful for scenarios where a JavaScript-based config is no longer available, allowing retrieval of theme values using `getComputedStyle`. A JavaScript example demonstrates fetching a shadow value.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: JavaScript
CODE:

```
let styles = getComputedStyle(document.documentElement);let shadow = styles.getPropertyValue("--shadow-xl");
```

---

TITLE: Import Tailwind CSS into Main Stylesheet
DESCRIPTION: Add an `@import` statement to your primary CSS file, typically `src/index.css`. This line imports Tailwind's base styles, components, and utilities into your project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Configure Tailwind CSS PostCSS Plugin
DESCRIPTION: Creates `postcss.config.mjs` to add `@tailwindcss/postcss` as a PostCSS plugin, enabling Tailwind CSS processing.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: JavaScript
CODE:

```
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
```

---

TITLE: Handle Tailwind CSS v4 Outline Color Transitions
DESCRIPTION: Notes that `transition` and `transition-color` utilities in Tailwind CSS v4 now include the `outline-color` property. This can cause unwanted color transitions if an outline is added on focus. HTML examples demonstrate how to set the outline color unconditionally or for both states to avoid this.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: HTML
CODE:

```
<button class="transition hover:outline-2 hover:outline-cyan-500"></button><button class="outline-cyan-500 transition hover:outline-2"></button>
```

---

TITLE: Tailwind CSS: Basic grid-auto-columns Usage
DESCRIPTION: This example demonstrates the fundamental application of `auto-cols-max` within a grid layout. It shows how to control the size of implicitly-created grid columns using a predefined Tailwind CSS utility class.

SOURCE: https://tailwindcss.com/docs/grid-auto-columns

LANGUAGE: HTML
CODE:

```
<div class="grid auto-cols-max grid-flow-col">  <div>01</div>  <div>02</div>  <div>03</div></div>
```

---

TITLE: Tailwind CSS: Responsive Content for Pseudo-elements
DESCRIPTION: Illustrates how to apply different content values to `::before` or `::after` pseudo-elements based on screen size using Tailwind CSS responsive variants. The example shows changing content from 'Mobile' to 'Desktop' at medium screen sizes.

SOURCE: https://tailwindcss.com/docs/content

LANGUAGE: HTML
CODE:

```
<p class="before:content-['Mobile'] md:before:content-['Desktop'] ..."></p>
```

---

TITLE: Apply Responsive Background Position with Tailwind CSS
DESCRIPTION: This example illustrates how to apply different background positions based on screen sizes using Tailwind CSS responsive variants. The `md:` prefix ensures the `bg-top` utility is only applied at medium screen sizes and above, overriding the default `bg-center` for smaller screens.

SOURCE: https://tailwindcss.com/docs/background-position

LANGUAGE: HTML
CODE:

```
<div class="bg-center md:bg-top ...">  <!-- ... --></div>
```

---

TITLE: Access Tailwind CSS v4 Theme Values in Media Queries
DESCRIPTION: Explains that for specific cases like media queries where CSS variables are not fully supported, the `theme()` function can still be used. However, in v4, it requires using the CSS variable name instead of the old dot notation for theme values. A CSS example demonstrates this updated syntax.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
@media (width >= theme(screens.xl)) {@media (width >= theme(--breakpoint-xl)) {  /* ... */}}
```

---

TITLE: Apply Responsive Padding with Tailwind CSS Breakpoints
DESCRIPTION: Implement responsive padding by prefixing utilities with breakpoint variants like `md:`. This allows you to apply different padding values based on screen sizes, ensuring optimal layout across various devices. For example, `py-4 md:py-8` sets vertical padding to 4 units on small screens and 8 units on medium screens and above.

SOURCE: https://tailwindcss.com/docs/padding

LANGUAGE: HTML
CODE:

```
<div class="py-4 md:py-8">Responsive padding example.</div>
```

---

TITLE: Integrate Tailwind CSS v4 with Vite Plugin
DESCRIPTION: For Vite projects, switch from the PostCSS plugin to the new dedicated `@tailwindcss/vite` plugin for improved performance and developer experience when upgrading to Tailwind CSS v4.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: TypeScript
CODE:

```
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});
```

---

TITLE: Update Tailwind CSS ring utility to ring-3
DESCRIPTION: Demonstrates how to update the `ring` utility to `ring-3` in HTML to match the new default width in Tailwind CSS v4.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: html
CODE:

```
<button class="focus:ring ..."><button class="focus:ring-3 ...">  <!-- ... --></button>
```

---

TITLE: Import Tailwind CSS into Application
DESCRIPTION: Adds an `@import` rule to the main application CSS file (e.g., `./app/app.css`) to include the Tailwind CSS framework, making its utility classes available throughout the project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Import Tailwind CSS into application stylesheet
DESCRIPTION: Add an `@import` rule to your main application CSS file, typically `assets/css/app.css`, to include the Tailwind CSS framework. This makes Tailwind's utility classes available for use in your project.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Integrate Tailwind CSS into HTML
DESCRIPTION: This HTML snippet demonstrates how to link the compiled CSS file and apply Tailwind's utility classes to elements. It shows a basic h1 element styled with Tailwind classes.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: html
CODE:

```
<!doctype html><html>  <head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <link href="./index.css" type="text/css" rel="stylesheet" />  </head>  <body>    <h1 class="text-3xl font-bold underline">      Hello world!    </h1>  </body></html>
```

---

TITLE: Import Tailwind CSS and configure source paths in app.css
DESCRIPTION: Import Tailwind CSS into your main application CSS file (`app.css`) and specify the directories where Tailwind should scan for utility classes, including Laravel Blade views and JavaScript files.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

LANGUAGE: css
CODE:

```
@import 'tailwindcss';
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';
@source '../**/*.blade.php';
@source '../**/*.js';
```

---

TITLE: Apply Responsive Max Height with Tailwind CSS
DESCRIPTION: Shows how to apply different `max-height` utilities based on screen size using responsive variants. The example sets a full height by default and `max-h-screen` for medium screens and up.

SOURCE: https://tailwindcss.com/docs/max-height

LANGUAGE: HTML
CODE:

```
<div class="h-48 max-h-full md:max-h-screen ...">  <!-- ... --></div>
```

---

TITLE: Configure Tailwind CSS theme variables with a prefix
DESCRIPTION: Shows how to define theme variables in CSS when using a prefix, noting that the variables themselves are defined without the prefix.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@import "tailwindcss" prefix(tw);@theme {  --font-display: "Satoshi", "sans-serif";  --breakpoint-3xl: 120rem;  --color-avocado-100: oklch(0.99 0 0);  --color-avocado-200: oklch(0.98 0.04 113.22);  --color-avocado-300: oklch(0.94 0.11 115.03);  /* ... */}
```

---

TITLE: Generated CSS variables with Tailwind CSS prefix
DESCRIPTION: Illustrates how Tailwind CSS generates prefixed CSS variables from theme configurations to avoid conflicts.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
:root {  --tw-font-display: "Satoshi", "sans-serif";  --tw-breakpoint-3xl: 120rem;  --tw-color-avocado-100: oklch(0.99 0 0);  --tw-color-avocado-200: oklch(0.98 0.04 113.22);  --tw-color-avocado-300: oklch(0.94 0.11 115.03);  /* ... */}
```

---

TITLE: Configure Tailwind CSS PostCSS plugin
DESCRIPTION: Creates a `postcss.config.mjs` file in the project root and adds `@tailwindcss/postcss` to the PostCSS plugin configuration. This explicitly tells PostCSS to use the Tailwind CSS plugin to process your CSS.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: JavaScript
CODE:

```
export default {  plugins: {    "@tailwindcss/postcss": {},  },};
```

---

TITLE: Enable PostCSS Loader in Rspack Configuration
DESCRIPTION: Configures `rspack.config.ts` to enable PostCSS support by adding a rule to process CSS files using `postcss-loader`.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: TypeScript
CODE:

```
export default defineConfig({  // ...  module: {    rules: [      {        test: /\.css$/,        use: ["postcss-loader"],        type: "css"      },      // ...    ]  }})
```

---

TITLE: Import Tailwind CSS into the global stylesheet
DESCRIPTION: This CSS `@import` statement adds the Tailwind CSS directives to your global stylesheet (`./app/globals.css`), making Tailwind's utility classes available throughout your Next.js application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Import Tailwind CSS into your project
DESCRIPTION: This step involves creating an index.css file and adding an @import rule for Tailwind CSS. This import statement pulls in all of Tailwind's base styles, components, and utilities.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: css
CODE:

```
@import "tailwindcss";
```

---

TITLE: Apply Tailwind CSS transition-behavior Utilities in HTML
DESCRIPTION: This example demonstrates how to apply `transition-discrete` and `md:transition-normal` Tailwind CSS utilities to an HTML button element. The `transition-discrete` class allows transitions for properties with discrete values, while `md:transition-normal` overrides this behavior to normal transitions on medium screens and above, showcasing responsive design application.

SOURCE: https://tailwindcss.com/docs/transition-behavior

LANGUAGE: HTML
CODE:

```
<button class="transition-discrete md:transition-normal ...">  <!-- ... --></button>
```

---

TITLE: Import global.css in gatsby-browser.js
DESCRIPTION: Creates or modifies `gatsby-browser.js` at the project root to import the global CSS file. This ensures that the Tailwind CSS styles are loaded and applied across the entire Gatsby application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: javascript
CODE:

```
import './src/styles/global.css';
```

---

TITLE: Tailwind CSS Responsive Vertical Alignment
DESCRIPTION: Shows how to implement responsive vertical alignment using Tailwind CSS breakpoint variants. This example applies `align-middle` by default and `md:align-top` for medium screen sizes and above, demonstrating adaptive layout based on viewport dimensions.

SOURCE: https://tailwindcss.com/docs/vertical-align

LANGUAGE: HTML
CODE:

```
<span class="align-middle md:align-top ...">  <!-- ... --></span>
```

---

TITLE: Apply Tailwind CSS justify-content Utilities Responsively with Breakpoints
DESCRIPTION: This example demonstrates how to apply `justify-content` utilities conditionally based on screen size using Tailwind CSS responsive design variants. The `md:` prefix ensures the `justify-between` utility is only active on medium screens and above, overriding `justify-start`.

SOURCE: https://tailwindcss.com/docs/justify-content

LANGUAGE: HTML
CODE:

```
<div class="flex justify-start md:justify-between ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS visited variant
DESCRIPTION: Styles a link that has already been visited by the user. This example changes the text color of a visited link.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<a href="https://seinfeldquotes.com" class="text-blue-600 visited:text-purple-600 ..."> Inspiration </a>
```

---

TITLE: Set Linear Gradient Start Point for mask-image in Tailwind CSS
DESCRIPTION: Utilities to control the starting point or color of a linear gradient mask. This allows specifying a number, percentage, color, custom property, or arbitrary value for the gradient's 'from' stop.

SOURCE: https://tailwindcss.com/docs/mask-image

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(var(--tw-mask-linear-position), black calc(var(--spacing) * <number>), transparent var(--tw-mask-linear-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(var(--tw-mask-linear-position), black <percentage>, transparent var(--tw-mask-linear-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(var(--tw-mask-linear-position), <color> var(--tw-mask-linear-from), transparent var(--tw-mask-linear-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(var(--tw-mask-linear-position), black var(<custom-property>), transparent var(--tw-mask-linear-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(var(--tw-mask-linear-position), black <value>, transparent var(--tw-mask-linear-to));
```

---

TITLE: Responsive Text Decoration Style with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply a responsive text decoration style using Tailwind CSS. It shows how to make an underlined paragraph have a dashed decoration from medium screen sizes (`md:`) upwards, combining the `underline` and `md:decoration-dashed` utility classes on an HTML `<p>` element.

SOURCE: https://tailwindcss.com/docs/text-decoration-style

LANGUAGE: HTML
CODE:

```
<p class="underline md:decoration-dashed ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Margin Start with Tailwind CSS
DESCRIPTION: These Tailwind CSS utilities apply margin to the start of an element's inline axis, supporting numeric values, auto, pixel values, custom CSS properties, and arbitrary values.

SOURCE: https://tailwindcss.com/docs/margin

LANGUAGE: CSS
CODE:

```
margin-inline-start: calc(var(--spacing) * <number>);
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: calc(var(--spacing) * -<number>);
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: auto;
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: 1px;
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: -1px;
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: var(<custom-property>);
```

LANGUAGE: CSS
CODE:

```
margin-inline-start: <value>;
```

---

TITLE: Add Tailwind CSS PostCSS plugin
DESCRIPTION: Creates a `postcss.config.mjs` file in the project root. This file configures PostCSS to include the `@tailwindcss/postcss` plugin, which processes Tailwind CSS directives in your stylesheets.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: JavaScript
CODE:

```
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

---

TITLE: Implementing Responsive Grid Columns with Tailwind CSS
DESCRIPTION: Shows how to apply responsive design to grid columns using breakpoint variants like `md:`. This example sets a single column grid by default and switches to a six-column grid on medium screens and above, adapting the layout to different screen sizes for optimal viewing.

SOURCE: https://tailwindcss.com/docs/grid-template-columns

LANGUAGE: HTML
CODE:

```
<div class="grid grid-cols-1 md:grid-cols-6 ...">  <!-- ... --></div>
```

---

TITLE: Update Tailwind CSS Space-Between Utilities Selector (v3 to v4)
DESCRIPTION: Tailwind CSS v4 updates the internal selector for `space-x-*` and `space-y-*` utilities to improve performance, changing from `:not([hidden]) ~ :not([hidden])` to `:not(:last-child)`. This may affect projects using these utilities with inline elements or custom child margins. The recommended migration for issues is to use Flexbox or Grid with `gap`. This snippet shows the CSS selector change and an HTML example for migrating to `gap`.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
/* Before */.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}/* Now */.space-y-4 > :not(:last-child) {
  margin-bottom: 1rem;
}
```

LANGUAGE: HTML
CODE:

```
<div class="space-y-4 p-4"><div class="flex flex-col gap-4 p-4">  <label for="name">Name</label>  <input type="text" name="name" /></div>
```

---

TITLE: Configure PostCSS to use Tailwind CSS plugin
DESCRIPTION: This JavaScript configuration file sets up PostCSS to include the `@tailwindcss/postcss` plugin. This is essential for processing Tailwind's directives and generating the final CSS output.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: JavaScript
CODE:

```
export default {  plugins: {    "@tailwindcss/postcss": {},  },};
```

---

TITLE: Apply Responsive Backface Visibility with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS `backface-visible` and `backface-hidden` utilities, including applying them responsively with breakpoint variants like `md:` to control an element's backface visibility based on screen size.

SOURCE: https://tailwindcss.com/docs/backface-visibility

LANGUAGE: HTML
CODE:

```
<div class="backface-visible md:backface-hidden ...">  <!-- ... --></div>
```

---

TITLE: Migrate Tailwind CLI Commands to v4 Package
DESCRIPTION: Update existing Tailwind CLI build commands to use the new `@tailwindcss/cli` package in v4. This involves changing `npx tailwindcss` to `npx @tailwindcss/cli`.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: Terminal
CODE:

```
npx tailwindcss -i input.css -o output.css
npx @tailwindcss/cli -i input.css -o output.css
```

---

TITLE: Apply Tailwind CSS Backdrop Contrast with Custom Values
DESCRIPTION: This example demonstrates how to use Tailwind CSS's arbitrary value syntax to apply a custom backdrop contrast filter. It shows both direct numeric values and the use of CSS variables for dynamic control.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-contrast

LANGUAGE: HTML
CODE:

```
<div class="backdrop-contrast-[.25] ...">  <!-- ... --></div>
```

LANGUAGE: HTML
CODE:

```
<div class="backdrop-contrast-(--my-backdrop-contrast) ...">  <!-- ... --></div>
```

---

TITLE: Enable PostCSS Loader in webpack.config.js
DESCRIPTION: Configures Webpack Encore to enable PostCSS processing by adding `.enablePostCssLoader()` to your `webpack.config.js` file. This step ensures that PostCSS plugins, including Tailwind CSS, are applied during asset compilation.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: JavaScript
CODE:

```
Encore  .enablePostCssLoader();
```

---

TITLE: Traditional CSS: Button Styling with Combined States
DESCRIPTION: This example presents a traditional CSS approach to styling a button, where a single `.btn` class manages both default and hover states. It highlights the difference from Tailwind's utility-first method, where styles for different states are applied via separate utility classes. The HTML shows the button element using this class.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: html
CODE:

```
<button class="btn">Save changes</button>
```

LANGUAGE: css
CODE:

```
.btn {
    background-color: var(--color-sky-500);
    &:hover {
      background-color: var(--color-sky-700);
    }
  }
```

---

TITLE: Apply Responsive Grid Styles with Tailwind CSS
DESCRIPTION: Demonstrates how Tailwind CSS generates media queries for responsive design. By prefixing utilities like `sm:grid-cols-3`, styles are applied only at specified breakpoints and above. This example shows the generated CSS for a small breakpoint grid.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: CSS
CODE:

```
.sm\:grid-cols-3 {  @media (width >= 40rem) {    grid-template-columns: repeat(3, minmax(0, 1fr));  }}
```

---

TITLE: Configure PostCSS for Tailwind CSS
DESCRIPTION: A .postcssrc file is created to enable the @tailwindcss/postcss plugin. This configuration ensures that PostCSS processes Tailwind CSS directives during the build process.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/parcel

LANGUAGE: json
CODE:

```
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

---

TITLE: Add global CSS file to Nuxt configuration
DESCRIPTION: Add the newly created `./app/assets/css/main.css` file to the `css` array in your `nuxt.config.ts` file. This ensures that your main CSS file, which imports Tailwind, is globally included in your Nuxt application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: TypeScript
CODE:

```
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
```

---

TITLE: Apply Tailwind CSS Border Radius Responsively
DESCRIPTION: This example illustrates how to make border radius utilities responsive by prefixing them with breakpoint variants. Using `md:rounded-lg` ensures the `rounded-lg` utility is only applied at medium screen sizes and above, allowing for different border radii across breakpoints.

SOURCE: https://tailwindcss.com/docs/border-radius

LANGUAGE: HTML
CODE:

```
<div class="rounded md:rounded-lg ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Text Decoration Thickness with Tailwind CSS
DESCRIPTION: This example illustrates how to apply text decoration thickness utilities responsively using Tailwind CSS. By prefixing utilities with breakpoint variants like `md:`, the thickness can be adjusted for different screen sizes, such as `md:decoration-4` for medium screens and above.

SOURCE: https://tailwindcss.com/docs/text-decoration-thickness

LANGUAGE: HTML
CODE:

```
<p class="underline md:decoration-4 ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Responsive
DESCRIPTION: No description

SOURCE: https://tailwindcss.com/docs/accent-color

---

TITLE: Configure Tailwind CSS Vite plugin in Astro
DESCRIPTION: Adds the `@tailwindcss/vite` plugin to the `plugins` array within the `vite` configuration object in your Astro project's `astro.config.mjs` file, enabling Tailwind CSS processing.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/astro

LANGUAGE: JavaScript
CODE:

```
// @ts-checkimport { defineConfig } from "astro/config";import tailwindcss from "@tailwindcss/vite";// https://astro.build/configexport default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

---

TITLE: Applying Responsive Visibility with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS breakpoint variants, such as `md:`, to apply visibility utilities conditionally based on screen size. The element will be visible by default but become invisible on medium screens and above.

SOURCE: https://tailwindcss.com/docs/visibility

LANGUAGE: HTML
CODE:

```
<div class="visible md:invisible ...">  <!-- ... --></div>
```

---

TITLE: Import Tailwind CSS and configure source files in app.css
DESCRIPTION: This CSS snippet imports Tailwind CSS into the main application stylesheet. It also uses `@source` directives to tell Tailwind CSS which files to scan for utility classes, ensuring proper compilation of styles based on project usage.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/mix

LANGUAGE: css
CODE:

```
@import 'tailwindcss';
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';
@source '../**/*.blade.php';
@source '../**/*.js';
```

---

TITLE: Apply Tailwind CSS Classes in Svelte Component
DESCRIPTION: Demonstrates how to use Tailwind's utility classes directly in a Svelte component's HTML. It also shows how to define component-specific styles using PostCSS, referencing the Tailwind CSS theme.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

LANGUAGE: Svelte
CODE:

```
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
```

---

TITLE: Tailwind CSS Border Inline Start Color Utilities
DESCRIPTION: These Tailwind CSS utility classes allow setting the `border-inline-start-color` CSS property, which controls the color of the border on the logical start side of an element. This includes predefined color palettes like 'stone' and options for custom values, providing flexibility for design systems.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-s-stone-100
border-s-stone-200
border-s-stone-300
border-s-stone-400
border-s-stone-500
border-s-stone-600
border-s-stone-700
border-s-stone-800
border-s-stone-900
border-s-stone-950
border-s-(<custom-property>)
border-s-[<value>]
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
border-inline-start-color: var(--color-stone-200); /* oklch(92.3% 0.003 48.717) */
border-inline-start-color: var(--color-stone-300); /* oklch(86.9% 0.005 56.366) */
border-inline-start-color: var(--color-stone-400); /* oklch(70.9% 0.01 56.259) */
border-inline-start-color: var(--color-stone-500); /* oklch(55.3% 0.013 58.071) */
border-inline-start-color: var(--color-stone-600); /* oklch(44.4% 0.011 73.639) */
border-inline-start-color: var(--color-stone-700); /* oklch(37.4% 0.01 67.558) */
border-inline-start-color: var(--color-stone-800); /* oklch(26.8% 0.007 34.298) */
border-inline-start-color: var(--color-stone-900); /* oklch(21.6% 0.006 56.043) */
border-inline-start-color: var(--color-stone-950); /* oklch(14.7% 0.004 49.25) */
border-inline-start-color: var(<custom-property>);
border-inline-start-color: <value>;
```

---

TITLE: Apply Border Start Color with Tailwind CSS
DESCRIPTION: These Tailwind CSS utility classes allow developers to quickly set the `border-inline-start-color` property of an element. The `border-inline-start-color` property defines the color of the logical inline start border of an element, which corresponds to the left border in left-to-right writing modes and the right border in right-to-left writing modes. Each class maps to a specific color from the Tailwind CSS color palette, using CSS custom properties for color values.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-700 */
border-inline-start-color: var(--color-cyan-700); /* oklch(52% 0.105 223.128) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-800 */
border-inline-start-color: var(--color-cyan-800); /* oklch(45% 0.085 224.283) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-900 */
border-inline-start-color: var(--color-cyan-900); /* oklch(39.8% 0.07 227.392) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-950 */
border-inline-start-color: var(--color-cyan-950); /* oklch(30.2% 0.056 229.695) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-50 */
border-inline-start-color: var(--color-sky-50); /* oklch(97.7% 0.013 236.62) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-100 */
border-inline-start-color: var(--color-sky-100); /* oklch(95.1% 0.026 236.824) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-200 */
border-inline-start-color: var(--color-sky-200); /* oklch(90.1% 0.058 230.902) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-300 */
border-inline-start-color: var(--color-sky-300); /* oklch(82.8% 0.111 230.318) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-400 */
border-inline-start-color: var(--color-sky-400); /* oklch(74.6% 0.16 232.661) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-500 */
border-inline-start-color: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-600 */
border-inline-start-color: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-700 */
border-inline-start-color: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-800 */
border-inline-start-color: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-900 */
border-inline-start-color: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-sky-950 */
border-inline-start-color: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-50 */
border-inline-start-color: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-100 */
border-inline-start-color: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-200 */
border-inline-start-color: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-300 */
border-inline-start-color: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-400 */
border-inline-start-color: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-500 */
border-inline-start-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-600 */
border-inline-start-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-700 */
border-inline-start-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-800 */
border-inline-start-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-900 */
border-inline-start-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-blue-950 */
border-inline-start-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-50 */
border-inline-start-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-100 */
border-inline-start-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-200 */
border-inline-start-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-300 */
border-inline-start-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-400 */
border-inline-start-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-500 */
border-inline-start-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-600 */
border-inline-start-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-700 */
border-inline-start-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-800 */
border-inline-start-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-900 */
border-inline-start-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-indigo-950 */
border-inline-start-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-50 */
border-inline-start-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-100 */
border-inline-start-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-200 */
border-inline-start-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-300 */
border-inline-start-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-400 */
border-inline-start-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-500 */
border-inline-start-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-600 */
border-inline-start-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-700 */
border-inline-start-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-violet-800 */
border-inline-start-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
```

---

TITLE: Apply Tailwind CSS empty variant
DESCRIPTION: Styles an element if it has no children or text content. This example hides a list item if its content (person.hobby) is empty.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<ul>  {#each people as person}    <li class="empty:hidden ...">{person.hobby}</li>  {/each}</ul>
```

---

TITLE: Import Tailwind CSS into main stylesheet
DESCRIPTION: Adds an `@import` statement to your `app.css` file (typically located at `./assets/styles/app.css`) to include Tailwind CSS. An `@source` directive is also added to ignore the public directory, preventing recompile loops in watch mode.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/symfony

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
@source not "../../public";
```

---

TITLE: Tailwind CSS Border Start Color Utility Classes
DESCRIPTION: These utility classes map directly to the `border-inline-start-color` CSS property, enabling precise control over the border color on the inline start edge of an element. Each class specifies a color from a predefined palette (e.g., lime, green, emerald, teal, cyan) and a shade (e.g., 50, 100, ..., 950).

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-lime-600 */
border-inline-start-color: var(--color-lime-600); /* oklch(64.8% 0.2 131.684) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-lime-700 */
border-inline-start-color: var(--color-lime-700); /* oklch(53.2% 0.157 131.589) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-lime-800 */
border-inline-start-color: var(--color-lime-800); /* oklch(45.3% 0.124 130.933) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-lime-900 */
border-inline-start-color: var(--color-lime-900); /* oklch(40.5% 0.101 131.063) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-lime-950 */
border-inline-start-color: var(--color-lime-950); /* oklch(27.4% 0.072 132.109) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-50 */
border-inline-start-color: var(--color-green-50); /* oklch(98.2% 0.018 155.826) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-100 */
border-inline-start-color: var(--color-green-100); /* oklch(96.2% 0.044 156.743) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-200 */
border-inline-start-color: var(--color-green-200); /* oklch(92.5% 0.084 155.995) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-300 */
border-inline-start-color: var(--color-green-300); /* oklch(87.1% 0.15 154.449) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-400 */
border-inline-start-color: var(--color-green-400); /* oklch(79.2% 0.209 151.711) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-500 */
border-inline-start-color: var(--color-green-500); /* oklch(72.3% 0.219 149.579) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-600 */
border-inline-start-color: var(--color-green-600); /* oklch(62.7% 0.194 149.214) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-700 */
border-inline-start-color: var(--color-green-700); /* oklch(52.7% 0.154 150.069) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-800 */
border-inline-start-color: var(--color-green-800); /* oklch(44.8% 0.119 151.328) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-900 */
border-inline-start-color: var(--color-green-900); /* oklch(39.3% 0.095 152.535) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-green-950 */
border-inline-start-color: var(--color-green-950); /* oklch(26.6% 0.065 152.934) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-50 */
border-inline-start-color: var(--color-emerald-50); /* oklch(97.9% 0.021 166.113) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-100 */
border-inline-start-color: var(--color-emerald-100); /* oklch(95% 0.052 163.051) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-200 */
border-inline-start-color: var(--color-emerald-200); /* oklch(90.5% 0.093 164.15) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-300 */
border-inline-start-color: var(--color-emerald-300); /* oklch(84.5% 0.143 164.978) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-400 */
border-inline-start-color: var(--color-emerald-400); /* oklch(76.5% 0.177 163.223) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-500 */
border-inline-start-color: var(--color-emerald-500); /* oklch(69.6% 0.17 162.48) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-600 */
border-inline-start-color: var(--color-emerald-600); /* oklch(59.6% 0.145 163.225) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-700 */
border-inline-start-color: var(--color-emerald-700); /* oklch(50.8% 0.118 165.612) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-800 */
border-inline-start-color: var(--color-emerald-800); /* oklch(43.2% 0.095 166.913) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-900 */
border-inline-start-color: var(--color-emerald-900); /* oklch(37.8% 0.077 168.94) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-emerald-950 */
border-inline-start-color: var(--color-emerald-950); /* oklch(26.2% 0.051 172.552) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-50 */
border-inline-start-color: var(--color-teal-50); /* oklch(98.4% 0.014 180.72) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-100 */
border-inline-start-color: var(--color-teal-100); /* oklch(95.3% 0.051 180.801) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-200 */
border-inline-start-color: var(--color-teal-200); /* oklch(91% 0.096 180.426) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-300 */
border-inline-start-color: var(--color-teal-300); /* oklch(85.5% 0.138 181.071) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-400 */
border-inline-start-color: var(--color-teal-400); /* oklch(77.7% 0.152 181.912) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-500 */
border-inline-start-color: var(--color-teal-500); /* oklch(70.4% 0.14 182.503) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-600 */
border-inline-start-color: var(--color-teal-600); /* oklch(60% 0.118 184.704) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-700 */
border-inline-start-color: var(--color-teal-700); /* oklch(51.1% 0.096 186.391) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-800 */
border-inline-start-color: var(--color-teal-800); /* oklch(43.7% 0.078 188.216) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-900 */
border-inline-start-color: var(--color-teal-900); /* oklch(38.6% 0.063 188.416) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-teal-950 */
border-inline-start-color: var(--color-teal-950); /* oklch(27.7% 0.046 192.524) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-50 */
border-inline-start-color: var(--color-cyan-50); /* oklch(98.4% 0.019 200.873) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-100 */
border-inline-start-color: var(--color-cyan-100); /* oklch(95.6% 0.045 203.388) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-200 */
border-inline-start-color: var(--color-cyan-200); /* oklch(91.7% 0.08 205.041) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-300 */
border-inline-start-color: var(--color-cyan-300); /* oklch(86.5% 0.127 207.078) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-400 */
border-inline-start-color: var(--color-cyan-400); /* oklch(78.9% 0.154 211.53) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-500 */
border-inline-start-color: var(--color-cyan-500); /* oklch(71.5% 0.143 215.221) */
```

LANGUAGE: CSS
CODE:

```
/* Tailwind CSS: border-s-cyan-600 */
border-inline-start-color: var(--color-cyan-600); /* oklch(60.9% 0.126 221.723) */
```

---

TITLE: Apply Tailwind CSS appearance utility responsively
DESCRIPTION: Demonstrates how to use Tailwind CSS breakpoint variants like `md:` with `appearance` utilities to apply different styling based on screen sizes. This example shows a select element that is `appearance-auto` by default and `appearance-none` on medium screens and above.

SOURCE: https://tailwindcss.com/docs/appearance

LANGUAGE: HTML
CODE:

```
<select class="appearance-auto md:appearance-none ...">  <!-- ... --></select>
```

---

TITLE: Import Tailwind CSS into the main CSS file
DESCRIPTION: This line imports the Tailwind CSS framework into the project's main stylesheet. This makes all Tailwind utility classes available for use throughout the application's components.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Apply Responsive Transition Timing Functions in HTML
DESCRIPTION: Shows how to apply different transition timing functions based on screen size using responsive prefixes like `md:` in Tailwind CSS, enabling adaptive animation behavior.

SOURCE: https://tailwindcss.com/docs/transition-timing-function

LANGUAGE: HTML
CODE:

```
<button class="ease-out md:ease-in ...">  <!-- ... --></button>
```

---

TITLE: Tailwind CSS: Responsive Flex Grow
DESCRIPTION: Implement responsive flex grow behavior by prefixing utilities with breakpoint variants (e.g., `md:`). This example shows an item that grows by default but is prevented from growing (`grow-0`) on medium screens and above, adapting its layout based on viewport size.

SOURCE: https://tailwindcss.com/docs/flex-grow

LANGUAGE: HTML
CODE:

```
<div class="grow md:grow-0 ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS field-sizing utilities responsively
DESCRIPTION: This example demonstrates how to apply `field-sizing-content` and `field-sizing-fixed` utilities using Tailwind CSS. It specifically shows how to make a form control adjust its size based on content by default, and then switch to a fixed size on medium screens and above using the `md:` breakpoint variant.

SOURCE: https://tailwindcss.com/docs/field-sizing

LANGUAGE: HTML
CODE:

```
<input class="field-sizing-content md:field-sizing-fixed ..." />
```

---

TITLE: Enable gatsby-plugin-postcss in gatsby-config.js
DESCRIPTION: Modifies the `gatsby-config.js` file to include and enable `gatsby-plugin-postcss` in the list of Gatsby plugins. This ensures that Gatsby processes CSS files through PostCSS.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: javascript
CODE:

```
module.exports = {  plugins: [    'gatsby-plugin-postcss',    // ...  ],}
```

---

TITLE: Configure Vite to use Tailwind CSS plugin
DESCRIPTION: Modifies the `vite.config.ts` file to include the `@tailwindcss/vite` plugin in the Vite configuration. This step is crucial for enabling Tailwind CSS processing during the build and development processes.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/solidjs

LANGUAGE: TypeScript
CODE:

```
import { defineConfig } from 'vite';import solidPlugin from 'vite-plugin-solid';import tailwindcss from '@tailwindcss/vite';export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
```

---

TITLE: Import Tailwind CSS into application stylesheet
DESCRIPTION: Creates an `./app/app.css` file and adds an `@import` statement for `tailwindcss`. This line pulls in all of Tailwind's base styles, components, and utility classes into your application's main CSS bundle.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";
```

---

TITLE: Tailwind CSS: Responsive Outline Offset with Breakpoints
DESCRIPTION: This example demonstrates how to apply the `outline-offset` utility conditionally based on screen size using Tailwind CSS's responsive design variants, such as `md:` for medium screens and above.

SOURCE: https://tailwindcss.com/docs/outline-offset

LANGUAGE: html
CODE:

```
<div class="outline md:outline-offset-2 ...">  <!-- ... --></div>
```

---

TITLE: Set custom width using arbitrary values in Tailwind CSS
DESCRIPTION: Shows how to apply a completely custom width value to an element using the `w-[<value>]` syntax, for example, `w-[5px]`.

SOURCE: https://tailwindcss.com/docs/width

LANGUAGE: HTML
CODE:

```
<div class="w-[5px] ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS focus-within variant
DESCRIPTION: Styles an element when it or any of its descendants has focus. This example applies a shadow to a div when an input inside it is focused.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<div class="focus-within:shadow-lg ...">  <input type="text" /></div>
```

---

TITLE: Update PostCSS Configuration for Tailwind CSS v4
DESCRIPTION: Migrate PostCSS configurations for Tailwind CSS v4 by replacing the `tailwindcss` plugin with `@tailwindcss/postcss`. In v4, `postcss-import` and `autoprefixer` can often be removed as imports and vendor prefixing are handled automatically.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: JavaScript
CODE:

```
export default {  plugins: {    "postcss-import": {},    tailwindcss: {},    autoprefixer: {},    "@tailwindcss/postcss": {},  },};
```

---

TITLE: Set Inline Start Border Color with Tailwind CSS `border-s-*` Utilities
DESCRIPTION: These utilities apply a specific color to the `border-inline-start-color` CSS property, affecting the border on the 'start' side of the inline axis (e.g., left in LTR, right in RTL). They support predefined colors, keywords like `inherit`, `current`, `transparent`, `black`, `white`, and various shades of red.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: CSS
CODE:

```
border-s-inherit| border-inline-start-color: inherit;
```

LANGUAGE: CSS
CODE:

```
border-s-current| border-inline-start-color: currentColor;
```

LANGUAGE: CSS
CODE:

```
border-s-transparent| border-inline-start-color: transparent;
```

LANGUAGE: CSS
CODE:

```
border-s-black| border-inline-start-color: var(--color-black); /* #000 */
```

LANGUAGE: CSS
CODE:

```
border-s-white| border-inline-start-color: var(--color-white); /* #fff */
```

LANGUAGE: CSS
CODE:

```
border-s-red-50| border-inline-start-color: var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
```

LANGUAGE: CSS
CODE:

```
border-s-red-100| border-inline-start-color: var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
```

LANGUAGE: CSS
CODE:

```
border-s-red-200| border-inline-start-color: var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
```

LANGUAGE: CSS
CODE:

```
border-s-red-300| border-inline-start-color: var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
```

LANGUAGE: CSS
CODE:

```
border-s-red-400| border-inline-start-color: var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
```

---

TITLE: Apply Tailwind CSS focus-visible variant
DESCRIPTION: Styles an element when it has been focused using the keyboard. This example adds an outline to a button when focused via keyboard navigation.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<button class="focus-visible:outline-2 ...">Submit</button>
```

---

TITLE: Apply responsive isolation with Tailwind CSS
DESCRIPTION: Control isolation based on screen size by prefixing `isolation` utilities with responsive variants. For example, `md:isolation-auto` applies `isolation: auto;` only at medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/isolation

LANGUAGE: HTML
CODE:

```
<div class="isolate md:isolation-auto ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS disabled variant
DESCRIPTION: Styles an input element when it is in a disabled state. This example reduces the opacity of a disabled input field.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<input class="disabled:opacity-75 ..." />
```

---

TITLE: Preserve Tailwind CSS v3 placeholder color in Preflight
DESCRIPTION: CSS snippet to revert the placeholder text color behavior in Tailwind CSS v4 Preflight to use `gray-400` as in v3.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@layer base {  input::placeholder,  textarea::placeholder {    color: var(--color-gray-400);  }}
```

---

TITLE: Configure Vite for Tailwind CSS and React Router
DESCRIPTION: Modifies the `vite.config.ts` file to include the `@tailwindcss/vite` plugin for processing Tailwind CSS, the `@react-router/dev/vite` plugin for React Router development features, and `vite-tsconfig-paths` for TypeScript path resolution.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: TypeScript
CODE:

```
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
```

---

TITLE: Apply Negative Scroll Padding with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply a negative scroll padding value using Tailwind CSS by prefixing the class name with a dash. This sets `scroll-padding-inline-start` to a negative value.

SOURCE: https://tailwindcss.com/docs/scroll-padding

LANGUAGE: HTML
CODE:

```
<div class="-scroll-ps-6 snap-x ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Height with Tailwind CSS Breakpoints
DESCRIPTION: Demonstrates how to use breakpoint variants like `md:` with height utilities (e.g., `md:h-full`) to apply different height styles to an HTML element based on screen size, enabling responsive design.

SOURCE: https://tailwindcss.com/docs/height

LANGUAGE: HTML
CODE:

```
<div class="h-1/2 md:h-full ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS first-child variant
DESCRIPTION: Styles an element if it is the first child of its parent. This example removes top padding from the first list item in a loop.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<ul>  {#each people as person}    <li class="py-4 first:pt-0 ...">      <!-- ... -->    </li>  {/each}</ul>
```

---

TITLE: Implement Responsive Flex Behavior with Tailwind CSS
DESCRIPTION: Shows how to apply flex utilities conditionally based on screen size using breakpoint variants like `md:`. This enables responsive design, allowing flex item behavior to adapt across different viewports.

SOURCE: https://tailwindcss.com/docs/flex

LANGUAGE: HTML
CODE:

```
<div class="flex-none md:flex-1 ...">  <!-- ... --></div>
```

---

TITLE: Revert Tailwind CSS Preflight button cursor to pointer
DESCRIPTION: CSS to override the default `cursor: default` for buttons in Tailwind CSS v4 Preflight, restoring `cursor: pointer` behavior.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@layer base {  button:not(:disabled),  [role="button"]:not(:disabled) {    cursor: pointer;  }}
```

---

TITLE: Apply Tailwind CSS focus variant
DESCRIPTION: Styles an element when it receives keyboard or programmatic focus. This example changes the border color of an input field on focus.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<input class="border-gray-300 focus:border-blue-400 ..." />
```

---

TITLE: Apply Tailwind CSS only-child variant
DESCRIPTION: Styles an element if it is the only child of its parent. This example adjusts padding for a list item if it's the sole child.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<ul>  {#each people as person}    <li class="py-4 only:py-0 ...">      <!-- ... -->    </li>  {/each}</ul>
```

---

TITLE: Applying text-transform utilities in HTML with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `capitalize` and `uppercase` utilities to a paragraph element in HTML using Tailwind CSS. It also shows how to use a responsive breakpoint (`md:`) to apply the `uppercase` utility only at medium screen sizes and above, showcasing responsive design capabilities.

SOURCE: https://tailwindcss.com/docs/text-transform

LANGUAGE: HTML
CODE:

```
<p class="capitalize md:uppercase ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Customize Tailwind CSS Spacing Scale in Theme
DESCRIPTION: This example shows how to customize the default spacing scale in your Tailwind CSS configuration. By overriding the `--spacing` theme variable, you can define your own base unit for all spacing-related utilities.

SOURCE: https://tailwindcss.com/docs/margin

LANGUAGE: CSS
CODE:

```
@theme {
  --spacing: 1px;
}
```

---

TITLE: Apply Tailwind CSS target variant
DESCRIPTION: Styles an element if its ID matches the current URL fragment identifier. This example applies a shadow to a div when it's the target of the URL.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<div id="about" class="target:shadow-lg ...">  <!-- ... --></div>
```

---

TITLE: Applying Overridden Breakpoint in HTML
DESCRIPTION: This HTML example demonstrates the use of a responsive utility class (`sm:grid-cols-3`) after its corresponding breakpoint (`--breakpoint-sm`) has been overridden in the Tailwind CSS theme. The `sm:` variant will now apply at the custom 30rem viewport size.

SOURCE: https://tailwindcss.com/docs/theme

LANGUAGE: HTML
CODE:

```
<div class="grid grid-cols-1 sm:grid-cols-3">  <!-- ... --></div>
```

---

TITLE: Apply custom saturation filter with Tailwind CSS
DESCRIPTION: Use the `saturate-[<value>]` utility to apply a specific saturation level to an element. This example sets the saturation to 25%.

SOURCE: https://tailwindcss.com/docs/filter-saturate

LANGUAGE: HTML
CODE:

```
<img class="saturate-[.25] ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Tailwind CSS hover variant
DESCRIPTION: Styles an element when the user's mouse cursor hovers over it. This example changes the background color from black to white on hover.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<div class="bg-black hover:bg-white ...">  <!-- ... --></div>
```

---

TITLE: Apply Custom Rotation Value in Tailwind CSS
DESCRIPTION: This example demonstrates how to apply a custom rotation value using the `rotate-[<value>]` syntax in Tailwind CSS, specifically using radians for rotation.

SOURCE: https://tailwindcss.com/docs/rotate

LANGUAGE: HTML
CODE:

```
<img class="rotate-[3.142rad] ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Basic Border Colors with Tailwind CSS
DESCRIPTION: Demonstrates how to apply solid border colors to HTML elements using standard Tailwind CSS `border-*` utility classes. This example shows different color applications to multiple div elements.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: html
CODE:

```
<div class="border-4 border-indigo-500 ..."></div><div class="border-4 border-purple-500 ..."></div><div class="border-4 border-sky-500 ..."></div>
```

---

TITLE: Use Tailwind CSS in Vue Component
DESCRIPTION: Demonstrates how to apply Tailwind's utility classes within a Vue component (`App.vue`) to style HTML elements, such as setting text size, font weight, and adding an underline.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/vue

LANGUAGE: Vue
CODE:

```
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>
```

---

TITLE: Apply Responsive Opacity in HTML with Tailwind CSS
DESCRIPTION: This code demonstrates how to apply different opacity levels based on screen size using responsive variants. By prefixing an `opacity` utility with a breakpoint variant like `md:`, the utility will only take effect at that screen size and above. This enables adaptive designs where element transparency changes across various devices.

SOURCE: https://tailwindcss.com/docs/opacity

LANGUAGE: HTML
CODE:

```
<button class="opacity-50 md:opacity-100 ...">  <!-- ... --></button>
```

---

TITLE: Import Tailwind CSS into Angular styles
DESCRIPTION: Adds an `@import` statement to your main `src/styles.css` file to include Tailwind CSS. This makes Tailwind's utility classes globally available throughout your Angular application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: css
CODE:

```
@import "tailwindcss";
```

---

TITLE: Apply responsive list-style-image in HTML
DESCRIPTION: Illustrates how to apply `list-style-image` utilities conditionally based on screen size using responsive variants like `md:` in Tailwind CSS. This example sets no image by default and a custom image on medium screens and above.

SOURCE: https://tailwindcss.com/docs/list-style-image

LANGUAGE: HTML
CODE:

```
<div class="list-image-none md:list-image-[url(/img/checkmark.png)] ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS active variant
DESCRIPTION: Styles an element when it is being pressed, typically with a mouse click or touch. This example changes a button's background color while it's active.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<button class="bg-blue-500 active:bg-blue-600 ...">Submit</button>
```

---

TITLE: Apply mask-clip utilities in HTML with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `mask-clip` utilities, including responsive variants, directly within an HTML element using Tailwind CSS classes. It shows how to set a default `mask-clip-border` and override it with `md:mask-clip-padding` for medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/mask-clip

LANGUAGE: HTML
CODE:

```
<div class="mask-clip-border md:mask-clip-padding ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Transform Origin in Tailwind CSS
DESCRIPTION: This example shows how to use responsive variants like `md:` with `transform-origin` utilities in Tailwind CSS. By prefixing utilities with breakpoint variants, different origin points can be applied based on screen sizes, enabling adaptive layouts for various devices.

SOURCE: https://tailwindcss.com/docs/transform-origin

LANGUAGE: HTML
CODE:

```
<img class="origin-center md:origin-top ..." src="/img/mountains.jpg" />
```

---

TITLE: Use Inline Styles for Complex Arbitrary Values in HTML
DESCRIPTION: Illustrates when to revert to traditional inline styles for very complex arbitrary values that would be difficult to read or manage as Tailwind class names, providing an example for `grid-template-columns`.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: HTML
CODE:

```
<div class="grid-[2fr_max(0,var(--gutter-width))_calc(var(--gutter-width)+10px)]"><div style="grid-template-columns: 2fr max(0, var(--gutter-width)) calc(var(--gutter-width) + 10px)">  <!-- ... --></div>
```

---

TITLE: Apply bg
DESCRIPTION: No description

SOURCE: https://tailwindcss.com/docs/background-color

---

TITLE: Apply Tailwind CSS last-child variant
DESCRIPTION: Styles an element if it is the last child of its parent. This example removes bottom padding from the last list item in a loop.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<ul>  {#each people as person}    <li class="py-4 last:pb-0 ...">      <!-- ... -->    </li>  {/each}</ul>
```

---

TITLE: Re-center dialog elements in Tailwind CSS v4 Preflight
DESCRIPTION: CSS to add `margin: auto` to `<dialog>` elements, re-centering them after Preflight removed default margins in Tailwind CSS v4.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@layer base {  dialog {    margin: auto;  }}
```

---

TITLE: Configure PostCSS plugins for Tailwind CSS
DESCRIPTION: Creates or updates the `postcss.config.js` file at the project root to register `@tailwindcss/postcss` as a PostCSS plugin. This configuration tells PostCSS to use Tailwind CSS for processing styles.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/gatsby

LANGUAGE: javascript
CODE:

```
module.exports = {  plugins: {    "@tailwindcss/postcss": {},  },};
```

---

TITLE: Apply responsive text underline offset with Tailwind CSS
DESCRIPTION: This example illustrates how to apply the `text-underline-offset` utility responsively. By prefixing with a breakpoint variant like `md:`, the offset will only apply at medium screen sizes and above, adapting to different viewports.

SOURCE: https://tailwindcss.com/docs/text-underline-offset

LANGUAGE: HTML
CODE:

```
<p class="underline md:underline-offset-4 ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Tailwind CSS mask-origin utilities to HTML elements
DESCRIPTION: This example demonstrates how to apply `mask-origin` utilities like `mask-origin-border` and `mask-origin-padding` to an HTML `div` element. It also shows how to use responsive variants like `md:` to apply styles conditionally based on screen size, making the mask origin responsive.

SOURCE: https://tailwindcss.com/docs/mask-origin

LANGUAGE: HTML
CODE:

```
<div class="mask-origin-border md:mask-origin-padding ...">  <!-- ... --></div>
```

---

TITLE: Use a registered custom Tailwind CSS variant in HTML
DESCRIPTION: Shows how to apply the previously registered `theme-midnight` custom variant in HTML, for example, `theme-midnight:bg-black`, to style elements based on a custom theme data attribute, promoting reusability.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<html data-theme="midnight">  <button class="theme-midnight:bg-black ..."></button></html>
```

---

TITLE: Enable PostCSS Loader in Rspack Configuration
DESCRIPTION: Modify your `rspack.config.ts` file to enable PostCSS support. This involves adding a rule to process CSS files using `postcss-loader` within your Rspack module configuration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

LANGUAGE: TypeScript
CODE:

```
export default defineConfig({  // ...  module: {    rules: [      {        test: /\.css$/,        use: ["postcss-loader"],        type: "css"      },      // ...    ]  }})
```

---

TITLE: Applying Responsive Text Decoration with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply text decoration utilities responsively using Tailwind CSS. The `no-underline` class removes the underline by default, and `md:underline` adds an underline on medium screens and above, showcasing Tailwind's responsive design variants.

SOURCE: https://tailwindcss.com/docs/text-decoration-line

LANGUAGE: HTML
CODE:

```
<a class="no-underline md:underline ..." href="...">  <!-- ... --></a>
```

---

TITLE: Apply Responsive Aspect Ratio with Tailwind CSS Breakpoints
DESCRIPTION: Shows how to implement responsive design with Tailwind CSS by prefixing aspect ratio utilities with breakpoint variants, such as `md:`. This enables different aspect ratios to be applied to an element based on the screen size, adapting layouts for various devices.

SOURCE: https://tailwindcss.com/docs/aspect-ratio

LANGUAGE: HTML
CODE:

```
<iframe class="aspect-video md:aspect-square ..." src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
```

---

TITLE: Apply Tailwind CSS utility classes in Angular HTML
DESCRIPTION: Demonstrates how to directly use Tailwind's utility classes (e.g., `text-3xl`, `font-bold`, `underline`) within an Angular component's HTML template to style elements, showcasing the integration.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: html
CODE:

```
<h1 class="text-3xl font-bold underline">  Hello world!</h1>
```

---

TITLE: Apply responsive skew transformation with Tailwind CSS
DESCRIPTION: This example illustrates how to apply different skew transformations based on screen size using Tailwind CSS's responsive variants. The `md:skew-12` class applies a `skew-12` utility only for medium screen sizes and above, overriding the default `skew-3`.

SOURCE: https://tailwindcss.com/docs/skew

LANGUAGE: HTML
CODE:

```
<img class="skew-3 md:skew-12 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Tailwind CSS first-of-type variant
DESCRIPTION: Styles an element if it is the first child of its specific type among its siblings. This example adjusts the left margin of the first anchor tag in a navigation.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="ml-2 first-of-type:ml-6 ...">      <!-- ... -->    </a>  {/each}</nav>
```

---

TITLE: Define Custom Font with @font-face CSS Rule
DESCRIPTION: Provides an example of the `@font-face` CSS at-rule to load and define a custom font, specifying its family, style, weight, display, and source.

SOURCE: https://tailwindcss.com/docs/font-family

LANGUAGE: CSS
CODE:

```
@font-face {  font-family: Oswald;  font-style: normal;  font-weight: 200 700;  font-display: swap;  src: url("/fonts/Oswald.woff2") format("woff2");}
```

---

TITLE: Apply background-blend-mode with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `background-blend-mode` utilities in Tailwind CSS. It shows a `div` element with a blue background, a background image, and applies `bg-blend-lighten` by default, which changes to `md:bg-blend-darken` on medium screens and above, showcasing responsive blending.

SOURCE: https://tailwindcss.com/docs/background-blend-mode

LANGUAGE: HTML
CODE:

```
<div class="bg-blue-500 bg-[url(/img/mountains.jpg)] bg-blend-lighten md:bg-blend-darken ...">  <!-- ... --></div>
```

---

TITLE: Responsive object-fit with Tailwind CSS
DESCRIPTION: This example shows how to apply different `object-fit` behaviors based on screen size using Tailwind CSS responsive variants. The image will `object-contain` by default and switch to `object-cover` on medium screens and larger, ensuring flexible image display across devices.

SOURCE: https://tailwindcss.com/docs/object-fit

LANGUAGE: HTML
CODE:

```
<img class="object-contain md:object-cover" src="/img/mountains.jpg" />
```

---

TITLE: Control Z-index Responsively with Breakpoint Variants in Tailwind CSS
DESCRIPTION: To apply `z-index` utilities only at specific screen sizes, prefix them with a breakpoint variant. This example sets a default `z-index` of `0` and changes it to `50` for medium screen sizes and above, enabling responsive stacking.

SOURCE: https://tailwindcss.com/docs/z-index

LANGUAGE: HTML
CODE:

```
<div class="z-0 md:z-50 ...">  <!-- ... --></div>
```

---

TITLE: Using Tailwind Color Variables as Arbitrary Values in HTML
DESCRIPTION: This example illustrates how to use Tailwind's arbitrary value syntax in HTML to apply CSS variables directly. It shows a practical application with `light-dark()` to dynamically switch colors based on the user's theme preference.

SOURCE: https://tailwindcss.com/docs/colors

LANGUAGE: HTML
CODE:

```
<div class="bg-[light-dark(var(--color-white),var(--color-gray-950))]">
  <!-- ... -->
</div>
```

---

TITLE: Applying Tailwind CSS scroll-snap-stop Responsively
DESCRIPTION: This example demonstrates how to apply `scroll-snap-stop` utilities responsively using Tailwind CSS breakpoint variants. The `snap-always` utility is applied by default, while `md:snap-normal` overrides it for medium screen sizes and above, allowing skipping snap positions.

SOURCE: https://tailwindcss.com/docs/scroll-snap-stop

LANGUAGE: HTML
CODE:

```
<div class="snap-always md:snap-normal ...">  <!-- ... --></div>
```

---

TITLE: Add default ring color in Tailwind CSS v4
DESCRIPTION: Shows how to explicitly add `ring-blue-500` to maintain the default ring color behavior from Tailwind CSS v3 in v4.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: html
CODE:

```
<button class="focus:ring-3 focus:ring-blue-500 ...">  <!-- ... --></button>
```

---

TITLE: Tailwind CSS Nested CSS Input
DESCRIPTION: Shows an example of nested CSS syntax that Tailwind CSS processes using Lightning CSS. This demonstrates how Tailwind handles modern CSS features like nesting, which can then be flattened for broader browser compatibility.

SOURCE: https://tailwindcss.com/docs/compatibility

LANGUAGE: CSS
CODE:

```
.typography {
  p {
    font-size: var(--text-base);
  }
  img {
    border-radius: var(--radius-lg);
  }
}
```

---

TITLE: Tailwind CSS: grid-auto-columns with CSS Variable
DESCRIPTION: This example shows how to use a CSS variable to set the `grid-auto-columns` property. The `auto-cols-(<custom-property>)` syntax is a convenient shorthand that automatically wraps the custom property in `var()`.

SOURCE: https://tailwindcss.com/docs/grid-auto-columns

LANGUAGE: HTML
CODE:

```
<div class="auto-cols-(--my-auto-cols) ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS nth-child(even) variant
DESCRIPTION: Styles an element if it is an evenly numbered child among its siblings. This example applies a different background color to even table rows.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<table>  {#each people as person}    <tr class="bg-white even:bg-gray-100 ...">      <!-- ... -->    </tr>  {/each}</table>
```

---

TITLE: Configure Ember CLI to use PostCSS
DESCRIPTION: Modifies the `ember-cli-build.js` file to enable PostCSS processing for CSS files. This configuration uses `@embroider/webpack` to set up a webpack rule that applies `postcss-loader` to all CSS files.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/emberjs

LANGUAGE: JavaScript
CODE:

```
'use strict';const EmberApp = require('ember-cli/lib/broccoli/ember-app');module.exports = function (defaults) {  const app = new EmberApp(defaults, {    // Add options here  });  const { Webpack } = require('@embroider/webpack');  return require('@embroider/compat').compatBuild(app, Webpack, {    skipBabel: [      {        package: 'qunit',      },    ],    packagerOptions: {      webpackConfig: {        module: {          rules: [            {              test: /\.css$/i,              use: ['postcss-loader'],            },          ],        },      },    },  });};
```

---

TITLE: Apply Responsive Text Shadows in Tailwind CSS
DESCRIPTION: This example illustrates how to make text shadows responsive using Tailwind CSS breakpoint variants. By prefixing utilities like `text-shadow-none` or `text-shadow-lg` with `md:`, you can control when text shadows are applied or removed based on screen size.

SOURCE: https://tailwindcss.com/docs/text-shadow

LANGUAGE: HTML
CODE:

```
<p class="text-shadow-none md:text-shadow-lg ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply responsive saturation filter with Tailwind CSS
DESCRIPTION: Apply different saturation levels based on screen size using responsive variants. This example sets 50% saturation by default and 150% on medium screens and above.

SOURCE: https://tailwindcss.com/docs/filter-saturate

LANGUAGE: HTML
CODE:

```
<img class="saturate-50 md:saturate-150 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Responsive Background Size in Tailwind CSS
DESCRIPTION: Shows how to use responsive prefixes like `md:` to apply `background-size` utilities conditionally based on screen size. In this example, `bg-auto` is the default background size, and `bg-contain` is applied for medium screens and above.

SOURCE: https://tailwindcss.com/docs/background-size

LANGUAGE: HTML
CODE:

```
<div class="bg-auto md:bg-contain ...">  <!-- ... --></div>
```

---

TITLE: Configure Vite to use Tailwind CSS plugin
DESCRIPTION: Adds the `@tailwindcss/vite` plugin to the `vite.config.ts` file. This configuration enables Vite to correctly process and compile Tailwind CSS directives during the development and build processes in an AdonisJS application.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

LANGUAGE: TypeScript
CODE:

```
import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    adonisjs({
      // …
    }),
  ],
})
```

---

TITLE: Mapping props to varied static class names for styling in JSX
DESCRIPTION: This example further demonstrates the flexibility of mapping props to complete class names. Different prop values can be mapped to distinct sets of classes, allowing for varied styling (e.g., different color shades or text colors) while maintaining static detectability for Tailwind.

SOURCE: https://tailwindcss.com/docs/detecting-classes-in-source-files

LANGUAGE: JSX
CODE:

```
function Button({ color, children }) {
  const colorVariants = {
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    red: "bg-red-500 hover:bg-red-400 text-white",
    yellow: "bg-yellow-300 hover:bg-yellow-400 text-black",
  };
  return <button className={`${colorVariants[color]} ...`}>{children}</button>;
}
```

---

TITLE: Apply Tailwind CSS nth-child(odd) variant
DESCRIPTION: Styles an element if it is an oddly numbered child among its siblings. This example applies a different background color to odd table rows.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<table>  {#each people as person}    <tr class="bg-white odd:bg-gray-100 ...">      <!-- ... -->    </tr>  {/each}</table>
```

---

TITLE: Apply Tailwind CSS font smoothing utilities in HTML
DESCRIPTION: This example demonstrates how to apply `antialiased` for grayscale antialiasing and `subpixel-antialiased` for subpixel antialiasing to a paragraph element in HTML. It also shows how to use responsive variants like `md:` to apply utilities at specific breakpoints.

SOURCE: https://tailwindcss.com/docs/font-smoothing

LANGUAGE: HTML
CODE:

```
<p class="antialiased md:subpixel-antialiased ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Tailwind CSS Utility Class Usage for Styling
DESCRIPTION: Provides an example of applying Tailwind CSS utility classes directly in HTML for styling a button element. This demonstrates the recommended workflow of composing styles in HTML, including hover effects and background colors, rather than writing extensive custom CSS.

SOURCE: https://tailwindcss.com/docs/compatibility

LANGUAGE: HTML
CODE:

```
<button class="bg-indigo-500 hover:bg-indigo-600 ...">
  <!-- ... --></button>
```

---

TITLE: Configure Tailwind CSS Vite plugin in Nuxt
DESCRIPTION: Add the `@tailwindcss/vite` plugin to your Nuxt configuration file (`nuxt.config.ts`) as a Vite plugin. This step ensures that Tailwind CSS is processed correctly by Vite within your Nuxt build process.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nuxt

LANGUAGE: TypeScript
CODE:

```
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
```

---

TITLE: Tailwind CSS: Responsive Grid Column Layouts
DESCRIPTION: Explains how to make grid column utilities responsive by prefixing them with breakpoint variants like `md:`, ensuring different layouts for various screen sizes.

SOURCE: https://tailwindcss.com/docs/grid-column

LANGUAGE: HTML
CODE:

```
<div class="col-span-2 md:col-span-6 ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS word-break utilities with responsive design
DESCRIPTION: This example demonstrates how to apply Tailwind CSS `word-break` utilities, specifically `break-normal` and `break-all`, to a paragraph element. It also shows how to use responsive design variants like `md:` to change the word-break behavior based on screen size, applying `break-normal` by default and `break-all` on medium screens and above.

SOURCE: https://tailwindcss.com/docs/word-break

LANGUAGE: HTML
CODE:

```
<p class="break-normal md:break-all ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Tailwind CSS: Responsive Display Utility Application
DESCRIPTION: Demonstrates how to apply Tailwind CSS display utilities conditionally based on screen size using responsive prefixes. For example, `md:inline-flex` will make an element `inline-flex` only on medium screens and above, enabling flexible layouts across different devices.

SOURCE: https://tailwindcss.com/docs/display

LANGUAGE: HTML
CODE:

```
<div class="flex md:inline-flex ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS utility classes in a Next.js React component
DESCRIPTION: This React component (`page.tsx`) demonstrates how to use Tailwind CSS utility classes (e.g., `text-3xl`, `font-bold`, `underline`) directly within JSX to style HTML elements.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/nextjs

LANGUAGE: TypeScript
CODE:

```
export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}
```

---

TITLE: Responsive Mask Mode with Tailwind CSS
DESCRIPTION: This example shows how to apply `mask-alpha` for default mask mode and `md:mask-luminance` to change the mask mode to luminance at medium screen sizes and above using Tailwind CSS classes on an HTML `div` element.

SOURCE: https://tailwindcss.com/docs/mask-mode

LANGUAGE: HTML
CODE:

```
<div class="mask-alpha md:mask-luminance ...">  <!-- ... --></div>
```

---

TITLE: Configure PostCSS to use Tailwind CSS plugin
DESCRIPTION: Creates or updates a `.postcssrc.json` file in the project root to include the `@tailwindcss/postcss` plugin in your PostCSS configuration. This step is crucial for PostCSS to process Tailwind CSS directives.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/angular

LANGUAGE: json
CODE:

```
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

---

TITLE: Tailwind CSS: Responsive Order Utilities
DESCRIPTION: Demonstrates how to apply different order utilities based on screen size using responsive variants like `md:` in Tailwind CSS. This allows for flexible layout adjustments across various breakpoints, such as `order-first` on small screens and `md:order-last` on medium screens and above.

SOURCE: https://tailwindcss.com/docs/order

LANGUAGE: HTML
CODE:

```
<div class="order-first md:order-last ...">  <!-- ... --></div>
```

---

TITLE: Configure Tailwind CSS in Laravel Mix
DESCRIPTION: This snippet shows how to add Tailwind CSS as a PostCSS plugin within the `webpack.mix.js` file. It configures Laravel Mix to process CSS files with Tailwind, enabling its utility classes.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/mix

LANGUAGE: javascript
CODE:

```
mix
  .js("resources/js/app.js", "public/js")
  .postCss("resources/css/app.css", "public/css", [
    require("@tailwindcss/postcss"),
  ]);
```

---

TITLE: Apply Tailwind CSS last-of-type variant
DESCRIPTION: Styles an element if it is the last child of its specific type among its siblings. This example adjusts the right margin of the last anchor tag in a navigation.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mr-2 last-of-type:mr-6 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Apply Tailwind CSS utilities in Vue/Svelte/CSS Modules with @reference
DESCRIPTION: In Tailwind CSS v4, stylesheets bundled separately (e.g., Vue `<style>` blocks, Svelte, CSS modules) require `@reference` to import theme variables, custom utilities, and variants from other files. This allows `@apply` to function correctly without duplicating CSS.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: Vue
CODE:

```
<template>  <h1>Hello world!</h1></template><style>  @reference "../../app.css";  h1 {    @apply text-2xl font-bold text-red-500;  }</style>
```

---

TITLE: Apply Responsive Text Wrapping with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS responsive variants to apply different text wrapping behaviors based on screen size. Here, `text-pretty` is applied by default, and `md:text-balance` overrides it for medium screens and above, ensuring balanced text for headings on larger displays.

SOURCE: https://tailwindcss.com/docs/text-wrap

LANGUAGE: HTML
CODE:

```
<h1 class="text-pretty md:text-balance ...">  <!-- ... --></h1>
```

---

TITLE: Apply Responsive List Style Position with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS utility classes to control the list-style-position. It sets `list-outside` as the default and applies `list-inside` for medium screen sizes and above, showcasing responsive design principles.

SOURCE: https://tailwindcss.com/docs/list-style-position

LANGUAGE: HTML
CODE:

```
<ul class="list-outside md:list-inside ...">  <!-- ... --></ul>
```

---

TITLE: Apply Responsive Animation with Tailwind CSS Breakpoints in HTML
DESCRIPTION: This HTML example illustrates how to control animation behavior responsively using Tailwind CSS. The element has no animation by default (`animate-none`) but applies a `spin` animation (`md:animate-spin`) on medium screens and larger.

SOURCE: https://tailwindcss.com/docs/animation

LANGUAGE: html
CODE:

```
<div class="animate-none md:animate-spin ...">
  <!-- ... -->
</div>
```

---

TITLE: Apply Tailwind CSS nth-child variant
DESCRIPTION: Styles an element at a specific position among its siblings using a formula or index. This example shows how to apply margins to specific or patterned anchor tags in a navigation.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mx-2 nth-3:mx-6 nth-[3n+1]:mx-7 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Apply Rotation with CSS Custom Property in Tailwind CSS
DESCRIPTION: This example shows how to use a CSS custom property (variable) for rotation with the `rotate-(<custom-property>)` syntax in Tailwind CSS, which is a shorthand for `rotate-[var(<custom-property>)]`.

SOURCE: https://tailwindcss.com/docs/rotate

LANGUAGE: HTML
CODE:

```
<img class="rotate-(--my-rotation) ..." src="/img/mountains.jpg" />
```

---

TITLE: Tailwind CSS: Responsive overflow-wrap Utility Application
DESCRIPTION: Illustrates how to apply Tailwind CSS `overflow-wrap` utilities, such as `wrap-normal` and `wrap-break-word`, responsively using breakpoint prefixes like `md:`. This allows for different text wrapping behaviors based on screen size.

SOURCE: https://tailwindcss.com/docs/overflow-wrap

LANGUAGE: HTML
CODE:

```
<p class="wrap-normal md:wrap-break-word ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply responsive font-stretch utilities in Tailwind CSS
DESCRIPTION: This example shows how to make `font-stretch` utilities responsive using breakpoint prefixes. By adding `md:` before a utility, the `font-stretch` property will only apply from the medium screen size breakpoint upwards, allowing for different font widths across various device sizes.

SOURCE: https://tailwindcss.com/docs/font-stretch

LANGUAGE: HTML
CODE:

```
<div class="font-stretch-normal md:font-stretch-expanded ...">  <!-- ... --></div>
```

---

TITLE: Preserve Tailwind CSS v3 default ring behavior with CSS variables
DESCRIPTION: Provides CSS theme variables to set the default ring width and color, preserving the Tailwind CSS v3 behavior in v4 for compatibility.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: css
CODE:

```
@theme {  --default-ring-width: 3px;  --default-ring-color: var(--color-blue-500);}
```

---

TITLE: Tailwind CSS: Defining Custom Variants with Shorthand Syntax
DESCRIPTION: Illustrates the shorthand syntax for defining custom variants when complex nesting is not required. This provides a more concise way to create simple variants.

SOURCE: https://tailwindcss.com/docs/adding-custom-styles

LANGUAGE: CSS
CODE:

```
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

---

TITLE: Apply Responsive Touch-Action Utilities in Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS `touch-action` utilities to control touch behavior on an HTML element. It shows applying `touch-pan-x` by default and `md:touch-auto` for medium screens and above, allowing for responsive control over scrolling and zooming.

SOURCE: https://tailwindcss.com/docs/touch-action

LANGUAGE: HTML
CODE:

```
<div class="touch-pan-x md:touch-auto ...">  <!-- ... --></div>
```

---

TITLE: Load Legacy JavaScript Configuration with @config Directive
DESCRIPTION: Demonstrates how to use the `@config` directive in CSS to load a legacy JavaScript-based Tailwind CSS configuration file. Notes that `corePlugins`, `safelist`, and `separator` options are not supported in v4.0, recommending `@source inline()` for safelisting utilities in v4.

SOURCE: https://tailwindcss.com/docs/functions-and-directives

LANGUAGE: CSS
CODE:

```
@config "../../tailwind.config.js";
```

---

TITLE: Apply Custom Numeric Gap in Tailwind CSS
DESCRIPTION: This example demonstrates how to set a custom gap value using arbitrary value syntax, such as `gap-[10vw]`, for precise spacing between grid or flexbox items. This allows for values not predefined in the default spacing scale.

SOURCE: https://tailwindcss.com/docs/gap

LANGUAGE: HTML
CODE:

```
<div class="gap-[10vw] ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive `align-self` Utility in HTML
DESCRIPTION: This example demonstrates how to apply the `align-self` utility responsively in HTML using Tailwind CSS. The `self-auto` class is applied by default, and `md:self-end` overrides it to `self-end` for medium screen sizes and above, showcasing how to adjust alignment based on breakpoints.

SOURCE: https://tailwindcss.com/docs/align-self

LANGUAGE: HTML
CODE:

```
<div class="self-auto md:self-end ...">  <!-- ... --></div>
```

---

TITLE: Use Tailwind CSS Utility Classes in React Component
DESCRIPTION: Demonstrates how to apply Tailwind CSS utility classes directly within a React component's JSX, styling an `<h1>` element with text size, font weight, and an underline.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/react-router

LANGUAGE: TypeScript
CODE:

```
export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )}

```

---

TITLE: Implement Basic Tailwind CSS Container Queries
DESCRIPTION: Shows how to mark an element as a container using `@container` and apply responsive styles to its children based on the container's size using variants like `@md`. This enables component-level responsiveness, making components more portable.

SOURCE: https://tailwindcss.com/docs/responsive-design

LANGUAGE: HTML
CODE:

```
<div class="@container">  <div class="flex flex-col @md:flex-row">    <!-- ... -->  </div></div>
```

---

TITLE: Apply justify-self utilities responsively with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `justify-self` utilities conditionally based on screen size using Tailwind CSS responsive variants. The `justify-self-start` utility is applied by default, and `md:justify-self-end` overrides it for medium screens and above, aligning the item to the end of its inline axis.

SOURCE: https://tailwindcss.com/docs/justify-self

LANGUAGE: HTML
CODE:

```
<div class="justify-self-start md:justify-self-end ...">  <!-- ... --></div>
```

---

TITLE: Generate Tailwind CSS from JSX Components
DESCRIPTION: Illustrates how Tailwind CSS scans project files, such as JSX components, to identify used utility classes and generate only the required CSS. This example shows a React `Button` component dynamically applying Tailwind classes based on a `size` prop. Tailwind processes these class names to produce an optimized stylesheet.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: JSX
CODE:

```
export default function Button({ size, children }) {  let sizeClasses = {    md: "px-4 py-2 rounded-md text-base",    lg: "px-5 py-3 rounded-lg text-lg",  }[size];  return (    <button type="button" className={`font-bold ${sizeClasses}`}>      {children}    </button>  );}
```

---

TITLE: Stacking Multiple Variants in Tailwind CSS
DESCRIPTION: Demonstrates how to combine multiple Tailwind CSS variants to target highly specific conditions. This example shows applying a background color change on hover, specifically in dark mode, and only at the medium breakpoint.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<button class="dark:md:hover:bg-fuchsia-600 ...">Save changes</button>
```

---

TITLE: Responsive Font Style with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply font style utilities responsively using Tailwind CSS. Text is initially italic (`italic`) and becomes normal (`not-italic`) on medium screens and above (`md:`).

SOURCE: https://tailwindcss.com/docs/font-style

LANGUAGE: HTML
CODE:

```
<p class="italic md:not-italic ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Responsive flex-shrink with Tailwind CSS Breakpoints
DESCRIPTION: Illustrates how to apply `flex-shrink` utilities conditionally based on screen size using Tailwind CSS responsive prefixes. This enables different shrinking behaviors for flex items at various breakpoints, adapting layouts to different device sizes.

SOURCE: https://tailwindcss.com/docs/flex-shrink

LANGUAGE: html
CODE:

```
<div class="shrink md:shrink-0 ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Sepia Filter with Tailwind CSS
DESCRIPTION: Illustrates how to apply a sepia filter conditionally based on screen size using Tailwind CSS responsive variants. The example shows applying a sepia filter by default and removing it on medium screens and above.

SOURCE: https://tailwindcss.com/docs/filter-sepia

LANGUAGE: HTML
CODE:

```
<img class="sepia md:sepia-0 ..." src="/img/mountains.jpg" />
```

---

TITLE: Implement Responsive Translation with Tailwind CSS
DESCRIPTION: Shows how to apply different translation values based on screen sizes using responsive variants in Tailwind CSS. This enables adaptive layouts where element positions can change at specific breakpoints.

SOURCE: https://tailwindcss.com/docs/translate

LANGUAGE: HTML
CODE:

```
<img class="translate-45 md:translate-60 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Tailwind CSS only-of-type variant
DESCRIPTION: Styles an element if it is the only child of its specific type among its siblings. This example adjusts horizontal margins for an anchor tag if it's the sole link in a navigation.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mx-2 only-of-type:mx-6 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Tailwind CSS grid-auto-rows Custom Values
DESCRIPTION: Illustrates how to set the size of implicitly-created grid rows using custom values with the `auto-rows-[<value>]` syntax, including an example with `minmax` and a shorthand for CSS variables using `auto-rows-(<custom-property>)`.

SOURCE: https://tailwindcss.com/docs/grid-auto-rows

LANGUAGE: HTML
CODE:

```
<div class="auto-rows-[minmax(0,2fr)] ...">  <!-- ... --></div>
```

LANGUAGE: HTML
CODE:

```
<div class="auto-rows-(--my-auto-rows) ...">  <!-- ... --></div>
```

---

TITLE: Control Column/Page Breaks with Tailwind CSS break-inside
DESCRIPTION: This example demonstrates how to use `break-inside-avoid-column` within an HTML structure to prevent a specific paragraph element from breaking across columns in a multi-column layout defined by `columns-2`.

SOURCE: https://tailwindcss.com/docs/break-inside

LANGUAGE: HTML
CODE:

```
<div class="columns-2">  <p>Well, let me tell you something, ...</p>  <p class="break-inside-avoid-column">Sure, go ahead, laugh...</p>  <p>Maybe we can live without...</p>  <p>Look. If you think this is...</p></div>
```

---

TITLE: Apply Responsive Filters with Tailwind CSS Breakpoints
DESCRIPTION: Illustrates how to apply or change filters based on screen size using responsive breakpoint variants like `md:` with Tailwind CSS filter utilities. This example removes a blur effect at medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/filter

LANGUAGE: HTML
CODE:

```
<img class="blur-sm md:filter-none ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Filters on Hover State with Tailwind CSS
DESCRIPTION: Explains how to apply or modify filters specifically when an element is hovered over, using the `hover:` variant prefix with filter utilities. This example removes a blur effect on hover.

SOURCE: https://tailwindcss.com/docs/filter

LANGUAGE: HTML
CODE:

```
<img class="blur-sm hover:filter-none ..." src="/img/mountains.jpg" />
```

---

TITLE: Use Custom Defined Font Weight Utility in Tailwind CSS
DESCRIPTION: After defining a custom font weight in the theme, this example shows how to apply the newly created utility class, such as `font-extrablack`, to an HTML element.

SOURCE: https://tailwindcss.com/docs/font-weight

LANGUAGE: HTML
CODE:

```
<div class="font-extrablack">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS nth-of-type variant
DESCRIPTION: Styles an element at a specific position among siblings of the same type. This example applies margins to specific or patterned anchor tags within a navigation, considering only other anchor tags.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mx-2 nth-of-type-3:mx-6 nth-of-type-[3n+1]:mx-7 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Set Opacity with CSS Variable in HTML with Tailwind CSS
DESCRIPTION: This example illustrates how to dynamically control opacity using a CSS custom property (variable). The `opacity-(<custom-property>)` syntax automatically wraps the custom property in `var()`, making it easy to link opacity to a global or component-specific CSS variable. This enhances maintainability and themeability.

SOURCE: https://tailwindcss.com/docs/opacity

LANGUAGE: HTML
CODE:

```
<button class="opacity-(--my-opacity) ...">  <!-- ... --></button>
```

---

TITLE: Apply Custom Theme Color to HTML Element with Tailwind CSS
DESCRIPTION: After defining a custom color in the theme, apply it to an HTML element. This example uses the `accent-regal-blue` utility class on an input checkbox, demonstrating integration with Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/accent-color

LANGUAGE: HTML
CODE:

```
<input class="accent-regal-blue" type="checkbox" />
```

---

TITLE: Apply Custom Margin Values in Tailwind CSS
DESCRIPTION: This example demonstrates how to use arbitrary values (e.g., `m-[5px]`) or reference CSS custom properties (e.g., `m-(--my-margin)`) directly within Tailwind CSS class names to apply custom margin sizes.

SOURCE: https://tailwindcss.com/docs/margin

LANGUAGE: HTML
CODE:

```
<div class="m-[5px] ...">  <!-- ... --></div>
```

LANGUAGE: HTML
CODE:

```
<div class="m-(--my-margin) ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS classes in a React component
DESCRIPTION: This React component demonstrates how to use Tailwind CSS utility classes to style an HTML element. It applies text size, font weight, and underline decorations directly within the JSX.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/meteor

LANGUAGE: JavaScript
CODE:

```
export const App = () => (  <h1 className="text-3xl font-bold underline">    Hello world!  </h1>)
```

---

TITLE: Apply Responsive Cursor Styles with Tailwind CSS
DESCRIPTION: Illustrates how to apply different cursor styles based on screen size using responsive variants like `md:` in Tailwind CSS. This allows for dynamic cursor behavior across various breakpoints.

SOURCE: https://tailwindcss.com/docs/cursor

LANGUAGE: HTML
CODE:

```
<button class="cursor-not-allowed md:cursor-auto ...">  <!-- ... --></button>
```

---

TITLE: Tailwind CSS: Responsive Position Utilities with Breakpoints (HTML)
DESCRIPTION: Apply position utilities conditionally based on screen size using breakpoint variants. For example, `md:top-6` sets `top-6` for medium screens and above in HTML.

SOURCE: https://tailwindcss.com/docs/top-right-bottom-left

LANGUAGE: HTML
CODE:

```
<div class="top-4 md:top-6 ...">  <!-- ... --></div>
```

---

TITLE: Implement Responsive Radial Mask Origin in Tailwind CSS
DESCRIPTION: Demonstrates how to make mask images responsive by applying different mask origins based on screen size using Tailwind's breakpoint variants. The example shows changing a radial mask's origin from 70% to 50% at medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/mask-image

LANGUAGE: html
CODE:

```
<div class="mask-radial-from-70% md:mask-radial-from-50% ...">  <!-- ... --></div>
```

---

TITLE: Applying Tailwind CSS color-scheme in HTML for Dark Mode
DESCRIPTION: This example demonstrates how to apply Tailwind CSS `color-scheme` utilities to an HTML element. It shows how to set a default light scheme and conditionally apply a dark scheme when the system is in dark mode using the `dark:` variant.

SOURCE: https://tailwindcss.com/docs/color-scheme

LANGUAGE: HTML
CODE:

```
<html class="scheme-light dark:scheme-dark ...">  <!-- ... --></html>
```

---

TITLE: Apply responsive backdrop invert with Tailwind CSS
DESCRIPTION: Shows how to use responsive variants, such as `md:`, to conditionally apply `backdrop-filter: invert()` utilities based on screen size. This example applies `backdrop-invert` from medium screens and up, while `backdrop-invert-0` is applied by default.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-invert

LANGUAGE: HTML
CODE:

```
<div class="backdrop-invert-0 md:backdrop-invert ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Mask Repeat Utilities in HTML
DESCRIPTION: This example demonstrates how to apply `mask-repeat` utilities responsively using Tailwind CSS. The `mask-repeat` class is applied by default, and `md:mask-repeat-x` ensures that the mask image repeats only horizontally on medium screens and above. This showcases how to use breakpoint variants with mask repetition utilities.

SOURCE: https://tailwindcss.com/docs/mask-repeat

LANGUAGE: html
CODE:

```
<div class="mask-repeat md:mask-repeat-x ...">  <!-- ... --></div>
```

---

TITLE: Implement Responsive Breakpoints and Container Queries in Tailwind CSS
DESCRIPTION: Demonstrates using responsive variants like `md` and `lg` to create a grid layout that adapts to different viewport widths. It also shows how to use `@container` variants to style elements based on the width of their parent container, rather than the viewport.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">  <!-- ... --></div>
```

LANGUAGE: html
CODE:

```
<div class="@container">  <div class="flex flex-col @md:flex-row">    <!-- ... -->  </div></div>
```

---

TITLE: Apply Tailwind CSS Caret Color Utilities
DESCRIPTION: These code examples demonstrate the CSS output generated by various Tailwind CSS utility classes for setting the `caret-color` property. Each entry shows a specific color utility and its corresponding CSS rule, utilizing CSS variables for color values.

SOURCE: https://tailwindcss.com/docs/caret-color

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-500); /* oklch(68.5% 0.169 237.323) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-600); /* oklch(58.8% 0.158 241.966) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-700); /* oklch(50% 0.134 242.749) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-800); /* oklch(44.3% 0.11 240.79) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-900); /* oklch(39.1% 0.09 240.876) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-sky-950); /* oklch(29.3% 0.066 243.157) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-50); /* oklch(97% 0.014 254.604) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-100); /* oklch(93.2% 0.032 255.585) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-200); /* oklch(88.2% 0.059 254.128) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-300); /* oklch(80.9% 0.105 251.813) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-400); /* oklch(70.7% 0.165 254.624) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
```

LANGUAGE: css
CODE:

```
caret-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
```

---

TITLE: Apply Tailwind CSS arbitrary `peer-*` variants
DESCRIPTION: Illustrates using arbitrary values within `peer-*` variants to style an element based on custom selectors on a sibling element. This example shows how to display a message based on a custom class (`is-dirty`) and the `required` state of a peer input.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<form>
  <label for="email">Email:</label>
  <input id="email" name="email" type="email" class="is-dirty peer" required />
  <div class="peer-[.is-dirty]:peer-required:block hidden">This field is required.</div>
  <!-- ... -->
</form>
```

---

TITLE: Apply responsive break-before utilities with Tailwind CSS
DESCRIPTION: Illustrates how to use responsive variants like `md:break-before-auto` to apply break-before utilities conditionally based on screen size, allowing for flexible layout control across different devices.

SOURCE: https://tailwindcss.com/docs/break-before

LANGUAGE: HTML
CODE:

```
<div class="break-before-column md:break-before-auto ...">  <!-- ... --></div>
```

---

TITLE: Apply Custom Letter Spacing with Tailwind CSS Arbitrary Values
DESCRIPTION: This example shows how to use Tailwind CSS's arbitrary value syntax to apply a specific letter spacing value directly to an element, providing fine-grained control over typography.

SOURCE: https://tailwindcss.com/docs/letter-spacing

LANGUAGE: HTML
CODE:

```
<p class="tracking-[.25em] ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Responsive Text Overflow with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS responsive variants like `md:` to apply `text-ellipsis` and `text-clip` utilities conditionally based on screen size, ensuring text overflow behavior adapts to different viewports.

SOURCE: https://tailwindcss.com/docs/text-overflow

LANGUAGE: HTML
CODE:

```
<p class="text-ellipsis md:text-clip ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Custom CSS Values with Tailwind CSS Arbitrary Values
DESCRIPTION: Shows how Tailwind CSS's square bracket syntax enables applying arbitrary, one-off CSS values directly within utility classes. This is useful for custom colors, complex grid definitions, CSS `calc()` functions, or even defining CSS variables. The examples demonstrate various use cases for this powerful feature.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: HTML
CODE:

```
<button class="bg-[#316ff6] ...">  Sign in with Facebook</button>
```

LANGUAGE: HTML
CODE:

```
<div class="grid grid-cols-[24rem_2.5rem_minmax(0,1fr)]">  <!-- ... --></div>
```

LANGUAGE: HTML
CODE:

```
<div class="max-h-[calc(100dvh-(--spacing(6)))]">  <!-- ... --></div>
```

LANGUAGE: HTML
CODE:

```
<div class="[--gutter-width:1rem] lg:[--gutter-width:2rem]">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS `peer-*` variant for sibling styling
DESCRIPTION: Explains how to use the `peer-*` variant to style an element based on the state of a preceding sibling element marked with the `peer` class. This example changes the text color of a label when its associated input is invalid.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<label>
  <span class="peer-invalid:text-red-500 ...">Email</span>
  <input type="email" class="peer ..." />
</label>
```

---

TITLE: Styling Lists with Tailwind CSS Utilities
DESCRIPTION: After Preflight unstyles lists, you can apply custom styles using Tailwind's `list-style-type` and `list-style-position` utilities. This example demonstrates how to add disc bullets inside the list item content.

SOURCE: https://tailwindcss.com/docs/preflight

LANGUAGE: HTML
CODE:

```
<ul class="list-inside list-disc">
  <li>One</li>
  <li>Two</li>
  <li>Three</li></ul>
```

---

TITLE: Apply Conditional Opacity in HTML with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply opacity conditionally based on an element's state, such as `disabled`. By prefixing an `opacity` utility with a variant like `disabled:*`, the opacity will only be applied when that state is active. This is useful for providing visual feedback for interactive elements.

SOURCE: https://tailwindcss.com/docs/opacity

LANGUAGE: HTML
CODE:

```
<input class="opacity-100 disabled:opacity-75 ..." type="text" />
```

---

TITLE: Remove default CSS import in Phoenix JavaScript
DESCRIPTION: Remove the default CSS import statement from your `assets/js/app.js` file. This step is necessary because Tailwind CSS is now managing your project's styling pipeline, making the direct CSS import redundant.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/phoenix

LANGUAGE: JavaScript
CODE:

```
// Remove this line if you add your own CSS build pipeline (e.g postcss).import "../css/app.css"
```

---

TITLE: Apply Tailwind CSS nth-last-of-type variant
DESCRIPTION: Styles an element at a specific position counting from the end among siblings of the same type. This example applies margins to specific or patterned anchor tags, counting from the last of their type.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: html
CODE:

```
<nav>  <img src="/logo.svg" alt="Vandelay Industries" />  {#each links as link}    <a href="#" class="mx-2 nth-last-of-type-3:mx-6 nth-last-of-type-[3n+1]:mx-7 ...">      <!-- ... -->    </a>  {/each}  <button>More</button></nav>
```

---

TITLE: Apply Responsive Resize Utilities in Tailwind CSS
DESCRIPTION: This example shows how to use Tailwind CSS responsive variants to control element resizing. By default, `resize-none` prevents resizing. However, `md:resize` overrides this on medium screens and above, enabling both horizontal and vertical resizing, demonstrating adaptive UI behavior.

SOURCE: https://tailwindcss.com/docs/resize

LANGUAGE: HTML
CODE:

```
<div class="resize-none md:resize ...">  <!-- ... --></div>
```

---

TITLE: Apply Custom Tailwind CSS Color Utility in HTML
DESCRIPTION: Demonstrates the usage of a custom color defined in the Tailwind CSS theme, such as `regal-blue`, within HTML markup. This example applies the `from-regal-blue` utility class to a `div` element.

SOURCE: https://tailwindcss.com/docs/background-image

LANGUAGE: HTML
CODE:

```
<div class="from-regal-blue">  <!-- ... --></div>
```

---

TITLE: Define responsive minimum width with Tailwind CSS breakpoints
DESCRIPTION: Shows how to make an element's minimum width responsive by applying different `min-w` utilities at various breakpoints, such as `md:min-w-0` for medium screens and above.

SOURCE: https://tailwindcss.com/docs/min-width

LANGUAGE: HTML
CODE:

```
<div class="w-24 min-w-full md:min-w-0 ...">  <!-- ... --></div>
```

---

TITLE: Apply responsive Tailwind CSS backdrop blur utilities
DESCRIPTION: Shows how to apply different backdrop blur utilities based on screen size using responsive variants. For example, `md:backdrop-blur-lg` applies a larger blur only on medium screens and above, while `backdrop-blur-none` removes blur by default on smaller screens.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-blur

LANGUAGE: HTML
CODE:

```
<div class="backdrop-blur-none md:backdrop-blur-lg ...">  <!-- ... --></div>
```

---

TITLE: Apply Custom Numeric Font Weight in Tailwind CSS
DESCRIPTION: This example demonstrates how to set a precise, custom numeric font weight using Tailwind CSS's arbitrary value syntax, `font-[<value>]`, allowing for weights not covered by default utilities.

SOURCE: https://tailwindcss.com/docs/font-weight

LANGUAGE: HTML
CODE:

```
<p class="font-[1000] ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply border-x-lime-200 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-lime-200` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a light shade of lime.

SOURCE: https://tailwindcss.com/docs/border-color

---

TITLE: Apply Responsive Stroke Width with Tailwind CSS Breakpoints
DESCRIPTION: Shows how to use responsive variants, such as `md:`, to apply different stroke widths based on screen sizes. For example, `stroke-1 md:stroke-2` sets a default stroke width of 1 and changes it to 2 on medium screens and above, enabling adaptive designs.

SOURCE: https://tailwindcss.com/docs/stroke-width

LANGUAGE: HTML
CODE:

```
<div class="stroke-1 md:stroke-2 ..."> <!-- ... --></div>
```

---

TITLE: Apply border-x-lime-100 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-lime-100` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very light shade of lime.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-lime-100
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-lime-100); /* oklch(96.7% 0.067 122.328) */
```

---

TITLE: Apply Tailwind CSS overscroll-behavior utilities responsively
DESCRIPTION: This example demonstrates how to apply `overscroll-behavior` utilities conditionally based on screen size using Tailwind CSS responsive variants. The `overscroll-auto` class is applied by default, and `overscroll-contain` is applied for medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/overscroll-behavior

LANGUAGE: HTML
CODE:

```
<div class="overscroll-auto md:overscroll-contain ...">
  <!-- ... -->
</div>
```

---

TITLE: Apply Responsive Blur with Tailwind CSS (HTML)
DESCRIPTION: Illustrates how to apply blur filters conditionally based on screen size using Tailwind CSS responsive prefixes. This example sets no blur by default and applies a large blur (`blur-lg`) on medium screens and above, demonstrating adaptive design.

SOURCE: https://tailwindcss.com/docs/filter-blur

LANGUAGE: HTML
CODE:

```
<img class="blur-none md:blur-lg ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Custom Cubic Bezier Transition Timing in HTML
DESCRIPTION: Demonstrates how to apply a custom `cubic-bezier` transition timing function directly within an HTML element's class using Tailwind CSS's `ease-[<value>]` syntax for precise control.

SOURCE: https://tailwindcss.com/docs/transition-timing-function

LANGUAGE: HTML
CODE:

```
<button class="ease-[cubic-bezier(0.95,0.05,0.795,0.035)] ...">  <!-- ... --></button>
```

---

TITLE: Default Tailwind CSS Theme Variables in theme.css
DESCRIPTION: This code illustrates the default theme variables provided by Tailwind CSS in its `theme.css` file. It covers examples of default fonts, colors, and shadows, which are used to generate the out-of-the-box utility classes.

SOURCE: https://tailwindcss.com/docs/theme

LANGUAGE: CSS
CODE:

```
@theme {  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;  --color-red-50: oklch(0.971 0.013 17.38);  --color-red-100: oklch(0.936 0.032 17.717);  --color-red-200: oklch(0.885 0.062 18.334);  /* ... */  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);  /* ... */}
```

---

TITLE: Apply border-x-lime-50 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-lime-50` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the lightest shade of lime.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-lime-50
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-lime-50); /* oklch(98.6% 0.031 120.757) */
```

---

TITLE: Apply Custom Backdrop Opacity in Tailwind CSS
DESCRIPTION: This example demonstrates how to set a custom backdrop opacity value using Tailwind CSS's arbitrary value syntax `backdrop-opacity-[<value>]` or by referencing a CSS variable with `backdrop-opacity-(<custom-property>)`.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-opacity

LANGUAGE: html
CODE:

```
<div class="backdrop-opacity-[.15] ...">  <!-- ... --></div>
```

LANGUAGE: html
CODE:

```
<div class="backdrop-opacity-(--my-backdrop-filter-opacity) ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS Background Attachment Responsively with HTML
DESCRIPTION: This HTML snippet demonstrates how to apply different background attachment utilities based on screen size using Tailwind CSS responsive prefixes. The background will be `local` by default and `fixed` on medium screens and above.

SOURCE: https://tailwindcss.com/docs/background-attachment

LANGUAGE: HTML
CODE:

```
<div class="bg-local md:bg-fixed ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Hyphenation with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply Tailwind CSS hyphenation utilities, specifically `hyphens-none` and `hyphens-auto`, with responsive design variants. The `md:hyphens-auto` class ensures that hyphenation behavior changes based on the screen size, preventing hyphens on small screens and allowing automatic hyphenation on medium screens and above.

SOURCE: https://tailwindcss.com/docs/hyphens

LANGUAGE: HTML
CODE:

```
<p class="hyphens-none md:hyphens-auto ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Customize Tailwind CSS Theme with Custom Color
DESCRIPTION: Provides an example of adding a new custom color (e.g., `regal-blue`) to the Tailwind CSS theme using the `@theme` directive, making it available for use in utility classes.

SOURCE: https://tailwindcss.com/docs/color

LANGUAGE: CSS
CODE:

```
@theme {  --color-regal-blue: #243c5a; }
```

---

TITLE: Apply Responsive Transition Properties with Tailwind CSS
DESCRIPTION: Shows how to use responsive variants like `md:` to conditionally apply `transition-property` utilities based on screen size, allowing different transition behaviors for various breakpoints.

SOURCE: https://tailwindcss.com/docs/transition-property

LANGUAGE: HTML
CODE:

```
<button class="transition-none md:transition-all ...">  <!-- ... --></button>
```

---

TITLE: Applying Tailwind CSS user-select utilities responsively
DESCRIPTION: This HTML snippet demonstrates how to apply Tailwind CSS `user-select` utilities, specifically `select-none` and `select-all`, with responsive design variants like `md:` to control text selection based on screen size.

SOURCE: https://tailwindcss.com/docs/user-select

LANGUAGE: HTML
CODE:

```
<div class="select-none md:select-all ...">  <!-- ... --></div>
```

---

TITLE: Control Accent Color Opacity with Modifiers
DESCRIPTION: This example demonstrates how to use Tailwind CSS color opacity modifiers to adjust the transparency of an element's accent color. Note that browser support for this feature is currently limited, primarily working in Firefox.

SOURCE: https://tailwindcss.com/docs/accent-color

LANGUAGE: HTML
CODE:

```
<input class="accent-rose-500/50" type="checkbox" />
```

---

TITLE: Apply responsive width utilities with Tailwind CSS breakpoints
DESCRIPTION: Explains how to apply width utilities conditionally based on screen sizes using breakpoint variants, such as `md:w-full`, to achieve responsive layouts.

SOURCE: https://tailwindcss.com/docs/width

LANGUAGE: HTML
CODE:

```
<div class="w-1/2 md:w-full ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Scroll Padding with Tailwind CSS Breakpoints
DESCRIPTION: This example illustrates how to apply scroll padding utilities conditionally based on screen size using Tailwind CSS responsive variants. The `scroll-p-8` class is applied by default, and `md:scroll-p-0` overrides it for medium screens and above.

SOURCE: https://tailwindcss.com/docs/scroll-padding

LANGUAGE: HTML
CODE:

```
<div class="scroll-p-8 md:scroll-p-0 ...">  <!-- ... --></div>
```

---

TITLE: Apply Tailwind CSS align-items Utilities Responsively
DESCRIPTION: This example demonstrates how to apply Tailwind CSS `align-items` utilities conditionally based on screen size using responsive variants. It shows items stretching by default and centering on medium screens and above, illustrating adaptive layout behavior.

SOURCE: https://tailwindcss.com/docs/align-items

LANGUAGE: HTML
CODE:

```
<div class="flex items-stretch md:items-center ...">  <!-- ... --></div>
```

---

TITLE: Use customized Tailwind CSS perspective utility
DESCRIPTION: This example demonstrates how to apply a custom perspective utility class in HTML after it has been defined in the Tailwind CSS theme. Once `--perspective-remote` is set in the theme, the `perspective-remote` class becomes available for use on any HTML element.

SOURCE: https://tailwindcss.com/docs/perspective

LANGUAGE: HTML
CODE:

```
<div class="perspective-remote">  <!-- ... --></div>
```

---

TITLE: Using complete class names for dynamic styling in HTML
DESCRIPTION: To ensure Tailwind detects classes, always provide complete class names in your source. This HTML example correctly applies dynamic styling by ensuring the full class names ('text-red-600' or 'text-green-600') are present and detectable by Tailwind's plain text scanner.

SOURCE: https://tailwindcss.com/docs/detecting-classes-in-source-files

LANGUAGE: HTML
CODE:

```
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

---

TITLE: Replace @tailwind Directives with CSS @import in v4
DESCRIPTION: In Tailwind CSS v4, the `@tailwind` directives are replaced by standard CSS `@import` statements. Update your CSS files to use `@import "tailwindcss";` instead of the individual `@tailwind` directives.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
@import "tailwindcss";
```

---

TITLE: Apply responsive list styles with Tailwind CSS breakpoints
DESCRIPTION: Illustrates how to make list styles responsive by prefixing utilities with breakpoint variants like `md:`. This allows for different list marker styles to be applied based on the screen size, adapting the design for various devices.

SOURCE: https://tailwindcss.com/docs/list-style-type

LANGUAGE: html
CODE:

```
<ul class="list-none md:list-disc ...">  <!-- ... --></ul>
```

---

TITLE: Apply border-x-amber-400 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-400` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-400
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
```

---

TITLE: Apply Responsive Perspective Origin in Tailwind CSS
DESCRIPTION: Shows how to use breakpoint variants like `md:` to apply different `perspective-origin` utilities based on screen sizes in Tailwind CSS, enabling responsive design for 3D transformations.

SOURCE: https://tailwindcss.com/docs/perspective-origin

LANGUAGE: HTML
CODE:

```
<div class="perspective-origin-center md:perspective-origin-bottom-left ...">  <!-- ... --></div>
```

---

TITLE: Revert to default scrolling with Tailwind CSS
DESCRIPTION: Illustrates applying the `scroll-auto` utility to revert to the browser's default instant scrolling behavior. This example also shows responsive application, where smooth scrolling is default but reverts to auto on medium screens and up.

SOURCE: https://tailwindcss.com/docs/scroll-behavior

LANGUAGE: HTML
CODE:

```
<html class="scroll-smooth md:scroll-auto">  <!-- ... --></html>
```

---

TITLE: Apply Responsive Stroke Colors to SVG with Tailwind CSS
DESCRIPTION: Demonstrates how to apply responsive stroke colors using breakpoint variants. For example, `md:stroke-cyan-700` will apply a different stroke color only on medium screens and above, allowing for adaptive designs.

SOURCE: https://tailwindcss.com/docs/stroke

LANGUAGE: HTML
CODE:

```
<svg class="stroke-cyan-500 md:stroke-cyan-700 ...">  <!-- ... --></svg>
```

---

TITLE: Apply responsive flex-basis utilities with Tailwind CSS
DESCRIPTION: Shows how to use responsive variants like `md:` with `flex-basis` utilities in Tailwind CSS. This enables applying different `flex-basis` values based on screen sizes, facilitating responsive layouts for flex items.

SOURCE: https://tailwindcss.com/docs/flex-basis

LANGUAGE: HTML
CODE:

```
<div class="flex flex-row">  <div class="basis-1/4 md:basis-1/3">01</div>  <div class="basis-1/4 md:basis-1/3">02</div>  <div class="basis-1/2 md:basis-1/3">03</div></div>
```

---

TITLE: Compose CSS Properties with Tailwind CSS Utilities
DESCRIPTION: Explains how Tailwind CSS allows composing multiple utility classes that target the same CSS property, such as `filter`. It achieves this by using CSS variables for each effect, which are then combined by the main property. This example shows HTML applying `blur-sm` and `grayscale`, and the corresponding generated CSS demonstrating variable usage.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: HTML
CODE:

```
<div class="blur-sm grayscale">  <!-- ... --></div>
```

LANGUAGE: CSS
CODE:

```
.blur-sm {  --tw-blur: blur(var(--blur-sm));  filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-grayscale,);}.grayscale {  --tw-grayscale: grayscale(100%);  filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-grayscale,);}
```

---

TITLE: Apply Responsive Flex Direction with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply responsive `flex-direction` utilities in Tailwind CSS. It uses `flex-col` to stack items vertically by default and `md:flex-row` to arrange them horizontally on medium screens and above, showcasing the use of breakpoint variants for responsive design.

SOURCE: https://tailwindcss.com/docs/flex-direction

LANGUAGE: HTML
CODE:

```
<div class="flex flex-col md:flex-row ...">  <!-- ... --></div>
```

---

TITLE: Implement Responsive Margin with Tailwind CSS Breakpoints
DESCRIPTION: This snippet illustrates how to apply different margin values based on screen sizes using Tailwind CSS's responsive variants. By prefixing a margin utility with a breakpoint (e.g., `md:`), the style will only apply at that breakpoint and above.

SOURCE: https://tailwindcss.com/docs/margin

LANGUAGE: HTML
CODE:

```
<div class="mt-4 md:mt-8 ...">  <!-- ... --></div>
```

---

TITLE: Restore pointer events with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS utilities to control pointer event behavior. It shows applying `pointer-events-none` by default and then overriding it with `md:pointer-events-auto` at the medium breakpoint, restoring default browser behavior for pointer events on an element.

SOURCE: https://tailwindcss.com/docs/pointer-events

LANGUAGE: HTML
CODE:

```
<div class="pointer-events-none md:pointer-events-auto ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-amber-500 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-500` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a standard shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-500
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
```

---

TITLE: Apply border-x-amber-50 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-50` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the lightest shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-50
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
```

---

TITLE: Apply border-x-amber-100 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-100` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very light shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-100
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
```

---

TITLE: Tailwind CSS box-sizing utility to CSS property mapping
DESCRIPTION: This snippet illustrates the direct mapping between Tailwind CSS utility classes for `box-sizing` and their corresponding native CSS properties. It shows how `box-border` sets `box-sizing: border-box;` and `box-content` sets `box-sizing: content-box;`.

SOURCE: https://tailwindcss.com/docs/box-sizing

LANGUAGE: CSS
CODE:

```
box-border: box-sizing: border-box;
```

LANGUAGE: CSS
CODE:

```
box-content: box-sizing: content-box;
```

---

TITLE: Apply responsive float utilities with Tailwind CSS
DESCRIPTION: This example demonstrates how to use Tailwind CSS's responsive float utilities to change an element's float behavior based on screen size. The image will float to the right by default and switch to floating left on medium screens and above.

SOURCE: https://tailwindcss.com/docs/float

LANGUAGE: HTML
CODE:

```
<img class="float-right md:float-left" src="/img/mountains.jpg" />
```

---

TITLE: Extend Tailwind CSS Theme with New Letter Spacing Utility
DESCRIPTION: This example shows how to add a new custom letter spacing utility, `tracking-tightest`, to the Tailwind CSS theme. Once defined, this utility can be directly used in HTML markup.

SOURCE: https://tailwindcss.com/docs/letter-spacing

LANGUAGE: CSS
CODE:

```
@theme {  --tracking-tightest: -0.075em; }
```

LANGUAGE: HTML
CODE:

```
<p class="tracking-tightest">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply border-x-amber-700 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-700` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a dark shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-700
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
```

---

TITLE: Apply border-x-amber-300 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-300` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-light shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-300
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
```

---

TITLE: Apply border-x-amber-200 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-200` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a light shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-200
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
```

---

TITLE: Apply Tailwind CSS box-decoration-break utilities to HTML elements
DESCRIPTION: This example demonstrates how to apply `box-decoration-clone` and `md:box-decoration-slice` classes to an HTML `div` element. These Tailwind CSS utilities control the `box-decoration-break` property, allowing elements to be rendered as continuous fragments or distinct blocks, with responsive variations for different screen sizes.

SOURCE: https://tailwindcss.com/docs/box-decoration-break

LANGUAGE: HTML
CODE:

```
<div class="box-decoration-clone md:box-decoration-slice ...">  <!-- ... --></div>
```

---

TITLE: Apply responsive align-content utilities in HTML
DESCRIPTION: Demonstrates how to use Tailwind CSS `align-content` utilities with responsive variants like `md:` to apply different row positioning based on screen size in a grid container.

SOURCE: https://tailwindcss.com/docs/align-content

LANGUAGE: HTML
CODE:

```
<div class="grid content-start md:content-around ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-amber-800 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-800` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very dark shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-800
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
```

---

TITLE: Apply Responsive Backdrop Opacity in Tailwind CSS
DESCRIPTION: This example illustrates how to apply different backdrop opacity values based on screen sizes using Tailwind CSS responsive variants. For instance, `md:backdrop-opacity-60` applies a 60% opacity from medium screens and up.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-opacity

LANGUAGE: html
CODE:

```
<div class="backdrop-opacity-100 md:backdrop-opacity-60 ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-yellow-50 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-50` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the lightest shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-50
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
```

---

TITLE: Apply Responsive Brightness Filters with Tailwind CSS
DESCRIPTION: Demonstrates how to apply different brightness filters based on screen size using responsive variants like `md:` in Tailwind CSS. This allows for adaptive designs where brightness can change at specific breakpoints.

SOURCE: https://tailwindcss.com/docs/filter-brightness

LANGUAGE: HTML
CODE:

```
<img class="brightness-110 md:brightness-150 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply border-x-yellow-400 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-400` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-400
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-400); /* oklch(85.2% 0.199 91.936) */
```

---

TITLE: Tailwind CSS: Responsive Backdrop Brightness
DESCRIPTION: Shows how to apply different backdrop brightness values based on screen size using responsive variants like `md:` in Tailwind CSS for adaptive designs.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-brightness

LANGUAGE: HTML
CODE:

```
<div class="backdrop-brightness-110 md:backdrop-brightness-150 ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-amber-600 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-600` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-dark shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-600
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
```

---

TITLE: Apply border-x-yellow-100 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-100` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very light shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-100
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-100); /* oklch(97.3% 0.071 103.193) */
```

---

TITLE: Apply Responsive Border Width in Tailwind CSS
DESCRIPTION: This example demonstrates how to apply responsive border widths using Tailwind CSS utility classes. The `md:` variant ensures that the `border-t-4` class (4px top border) is only applied at medium screen sizes and above, overriding the default `border-2` (2px border on all sides) for larger viewports.

SOURCE: https://tailwindcss.com/docs/border-width

LANGUAGE: HTML
CODE:

```
<div class="border-2 md:border-t-4 ...">  <!-- ... --></div>
```

---

TITLE: Responsive Object Position with Tailwind CSS
DESCRIPTION: Illustrates how to apply different `object-position` utilities based on screen sizes using responsive prefixes in Tailwind CSS. This enables adaptive layouts for various devices.

SOURCE: https://tailwindcss.com/docs/object-position

LANGUAGE: HTML
CODE:

```
<img class="object-center md:object-top ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply border-x-yellow-700 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-700` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a dark shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-700
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-700); /* oklch(55.4% 0.135 66.442) */
```

---

TITLE: Apply border-x-yellow-500 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-500` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a standard shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-500
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-500); /* oklch(79.5% 0.184 86.047) */
```

---

TITLE: Apply border-x-amber-950 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-950` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the darkest shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-950
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
```

---

TITLE: Apply border-x-yellow-600 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-600` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-dark shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-600
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-600); /* oklch(68.1% 0.162 75.834) */
```

---

TITLE: Apply border-x-yellow-300 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-300` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-light shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-300
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-300); /* oklch(90.5% 0.182 98.111) */
```

---

TITLE: Include compiled CSS and use Tailwind classes in Blade template
DESCRIPTION: This HTML snippet demonstrates how to include the compiled `app.css` in a Laravel Blade template and use Tailwind CSS utility classes. It shows a basic `h1` element styled with `text-3xl`, `font-bold`, and `underline` classes.

SOURCE: https://tailwindcss.com/docs/installation/framework-guides/laravel/mix

LANGUAGE: html
CODE:

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="{{ asset('css/app.css') }}" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </body>
</html>
```

---

TITLE: Apply border-x-yellow-200 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-200` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a light shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-200
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-200); /* oklch(94.5% 0.129 101.54) */
```

---

TITLE: Implement Responsive Grid Rows with Tailwind CSS Breakpoints
DESCRIPTION: Shows how to apply `grid-template-rows` utilities conditionally based on screen size using Tailwind CSS breakpoint variants. This example sets 2 rows by default and 6 rows for medium screens and above, allowing for adaptive grid layouts across different devices.

SOURCE: https://tailwindcss.com/docs/grid-template-rows

LANGUAGE: HTML
CODE:

```
<div class="grid grid-rows-2 md:grid-rows-6 ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-yellow-800 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-800` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very dark shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-800
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-800); /* oklch(47.6% 0.114 61.907) */
```

---

TITLE: Tailwind CSS Border Inline Start Color Utilities
DESCRIPTION: Provides a comprehensive list of Tailwind CSS utility classes for setting the border-inline-start color, along with their corresponding generated CSS properties. These utilities allow for precise control over the border color using various predefined color palettes and shades.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-s-rose-950
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-50
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-100
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-200
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-300
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-400
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-500
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-600
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-700
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-800
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-900
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-slate-950
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-50
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-100
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-200
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-300
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-400
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-500
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-600
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-700
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-800
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-900
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-gray-950
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-50
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-50); /* oklch(98.5% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-100
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-200
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-300
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-400
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-500
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-600
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-700
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-800
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-900
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-zinc-950
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-50
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-50); /* oklch(98.5% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-100
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-100); /* oklch(97% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-200
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-200); /* oklch(92.2% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-300
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-300); /* oklch(87% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-400
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-400); /* oklch(70.8% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-500
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-500); /* oklch(55.6% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-600
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-600); /* oklch(43.9% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-700
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-700); /* oklch(37.1% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-800
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-800); /* oklch(26.9% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-900
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-900); /* oklch(20.5% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-neutral-950
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-neutral-950); /* oklch(14.5% 0 0) */
```

LANGUAGE: Tailwind CSS
CODE:

```
border-s-stone-50
```

LANGUAGE: CSS
CODE:

```
border-inline-start-color: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
```

---

TITLE: Apply border-x-yellow-950 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-950` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the darkest shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-950
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-950); /* oklch(28.6% 0.066 53.813) */
```

---

TITLE: Apply Responsive White-Space in Tailwind CSS
DESCRIPTION: This example demonstrates how to apply different `white-space` utilities based on screen size using Tailwind CSS responsive variants. The text within the paragraph will initially preserve newlines and spaces (`whitespace-pre`), but will wrap normally (`whitespace-normal`) on medium screens and above (`md:` breakpoint).

SOURCE: https://tailwindcss.com/docs/white-space

LANGUAGE: HTML
CODE:

```
<p class="whitespace-pre md:whitespace-normal ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Responsive Tailwind CSS Line Clamping
DESCRIPTION: Adjust line clamping based on screen size using responsive variants. Prefix `line-clamp` utilities with breakpoints like `md:` to apply different values at various screen sizes.

SOURCE: https://tailwindcss.com/docs/line-clamp

LANGUAGE: HTML
CODE:

```
<div class="line-clamp-3 md:line-clamp-4 ...">  <!-- ... --></div>
```

---

TITLE: Style Enabled Input with Tailwind CSS `:enabled` Variant
DESCRIPTION: Demonstrates how to apply styles to an HTML input element when it is in an enabled state using the Tailwind CSS `:enabled` variant. This is useful for applying conditional styling, for example, when an element is not disabled, to differentiate its appearance.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<input class="enabled:hover:border-gray-400 disabled:opacity-75 ..." />
```

---

TITLE: Apply Tailwind CSS background-clip Utilities in HTML
DESCRIPTION: This HTML snippet demonstrates the application of Tailwind CSS `background-clip` utilities. It shows how to set `background-clip` to `border-box` by default and then responsively change it to `padding-box` on medium screens and above using `md:bg-clip-padding`.

SOURCE: https://tailwindcss.com/docs/background-clip

LANGUAGE: HTML
CODE:

```
<div class="bg-clip-border md:bg-clip-padding ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-orange-400 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-400` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-400
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-400); /* oklch(75% 0.183 55.934) */
```

---

TITLE: Apply Responsive Table Layout in HTML with Tailwind CSS
DESCRIPTION: Demonstrates how to apply `table-auto` and `table-fixed` utilities to an HTML div element, showcasing responsive behavior using the `md:` breakpoint variant. This allows the table layout to change based on screen size, providing flexibility for different viewports.

SOURCE: https://tailwindcss.com/docs/table-layout

LANGUAGE: HTML
CODE:

```
<div class="table-auto md:table-fixed ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Contrast Filter with Tailwind CSS
DESCRIPTION: Illustrates how to apply different contrast filters based on screen size using Tailwind CSS responsive variants. The `md:` prefix ensures the utility applies from medium screen sizes and up, overriding default contrast values.

SOURCE: https://tailwindcss.com/docs/filter-contrast

LANGUAGE: HTML
CODE:

```
<img class="contrast-125 md:contrast-150 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply border-x-orange-500 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-500` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a standard shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-500
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
```

---

TITLE: Apply border-x-orange-700 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-700` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a dark shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-700
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
```

---

TITLE: Apply Bottom-Origin Mask Image (From)
DESCRIPTION: These Tailwind CSS utilities generate a `mask-image` property with a linear gradient originating from the bottom. They define the starting point of the mask using a percentage, color, custom CSS property, or an arbitrary value, fading to transparent towards the top.

SOURCE: https://tailwindcss.com/docs/mask-image

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to bottom, black <percentage>, transparent var(--tw-mask-bottom-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to bottom, <color> var(--tw-mask-bottom-from), transparent var(--tw-mask-bottom-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to bottom, black var(<custom-property>), transparent var(--tw-mask-bottom-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to bottom, black <value>, transparent var(--tw-mask-bottom-to));
```

---

TITLE: Set Custom Background Position with Tailwind CSS
DESCRIPTION: This example demonstrates how to use the arbitrary value syntax `bg-position-[<value>]` in Tailwind CSS to set a custom background position for an element. This allows for precise control over the background image placement using any valid CSS position value.

SOURCE: https://tailwindcss.com/docs/background-position

LANGUAGE: HTML
CODE:

```
<div class="bg-position-[center_top_1rem] ...">  <!-- ... --></div>
```

---

TITLE: Apply border-x-orange-300 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-300` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-light shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-300
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
```

---

TITLE: Load Legacy JavaScript Plugin with @plugin Directive
DESCRIPTION: Illustrates the use of the `@plugin` directive in CSS to load a legacy JavaScript-based Tailwind CSS plugin. The directive accepts either a package name or a local path.

SOURCE: https://tailwindcss.com/docs/functions-and-directives

LANGUAGE: CSS
CODE:

```
@plugin "@tailwindcss/typography";
```

---

TITLE: Apply border-x-orange-600 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-600` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a medium-dark shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-600
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
```

---

TITLE: Apply custom Tailwind CSS column utility in HTML
DESCRIPTION: Demonstrates the usage of a custom column utility class, such as `columns-4xs`, in HTML after it has been defined and customized within the Tailwind CSS theme. This enables consistent application of custom column layouts.

SOURCE: https://tailwindcss.com/docs/columns

LANGUAGE: HTML
CODE:

```
<div class="columns-4xs">  <!-- ... --></div>
```

---

TITLE: Apply border-x-orange-200 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-200` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a light shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-200
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
```

---

TITLE: Apply border-x-orange-950 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-950` Tailwind CSS utility class. This utility sets the logical inline start and end borders to the darkest shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-950
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
```

---

TITLE: Set custom pixel text underline offset with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply a custom pixel value for the text underline offset. It uses the `underline-offset-[<value>]` arbitrary value syntax in Tailwind CSS to achieve precise control over the offset.

SOURCE: https://tailwindcss.com/docs/text-underline-offset

LANGUAGE: HTML
CODE:

```
<p class="underline-offset-[3px] ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply border-x-orange-800 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-800` Tailwind CSS utility class. This utility sets the logical inline start and end borders to a very dark shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-800
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-800); /* oklch(47% 0.157 37.304) */
```

---

TITLE: Apply Basic Outline Colors with Tailwind CSS
DESCRIPTION: Demonstrates how to apply predefined outline colors to an HTML element using Tailwind CSS utility classes. This example uses `outline-rose-500` and `outline-lime-100` to set distinct outline colors, assuming a base `outline` style is also applied.

SOURCE: https://tailwindcss.com/docs/outline-color

LANGUAGE: HTML
CODE:

```
<div class="outline outline-rose-500"></div>
<div class="outline outline-lime-100"></div>
```

---

TITLE: Apply Tailwind CSS `in-*` variant for implicit parent styling
DESCRIPTION: Demonstrates the `in-*` variant, which allows styling an element based on the state of any parent without explicitly adding the `group` class to the parent. This example changes the opacity of an element when any of its parents are focused.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<div tabindex="0">
  <div class="opacity-50 in-focus:opacity-100">
    <!-- ... -->
  </div>
</div>
```

---

TITLE: Extend Tailwind CSS Preflight Base Styles with CSS
DESCRIPTION: This snippet demonstrates how to add custom base styles to Tailwind CSS's Preflight using the `@layer base` directive. It shows an example of styling `h1`, `h2`, `h3`, and `a` elements with custom font sizes and colors. This allows users to augment or override Preflight's default resets.

SOURCE: https://tailwindcss.com/docs/preflight

LANGUAGE: CSS
CODE:

```
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  h2 {
    font-size: var(--text-xl);
  }
  h3 {
    font-size: var(--text-lg);
  }
  a {
    color: var(--color-blue-600);
    text-decoration-line: underline;
  }
}
```

---

TITLE: Apply Responsive Transition Delay with Tailwind CSS
DESCRIPTION: Shows how to use breakpoint variants, such as `md:`, to apply different `transition-delay` utilities based on screen size. This enables responsive animation behavior, allowing delays to change at specific breakpoints.

SOURCE: https://tailwindcss.com/docs/transition-delay

LANGUAGE: HTML
CODE:

```
<button class="delay-150 md:delay-300 ...">  <!-- ... --></button>
```

---

TITLE: Apply Tailwind CSS forced-color-adjust utilities in HTML
DESCRIPTION: This example demonstrates how to use `forced-color-adjust-none` to opt an element out of forced colors and `lg:forced-color-adjust-auto` to restore forced colors on larger screens. This is useful for maintaining usability when a limited color palette would degrade the experience, allowing for conditional adjustments based on screen size.

SOURCE: https://tailwindcss.com/docs/forced-color-adjust

LANGUAGE: HTML
CODE:

```
<form>
  <fieldset class="forced-color-adjust-none lg:forced-color-adjust-auto ...">
    <legend>Choose a color:</legend>
    <select class="hidden lg:block">
      <option value="White">White</option>
      <option value="Gray">Gray</option>
      <option value="Black">Black</option>
    </select>
    <div class="lg:hidden">
      <label>
        <input class="sr-only" type="radio" name="color-choice" value="White" />
        <!-- ... -->
      </label>
      <!-- ... -->
    </div>
  </fieldset>
</form>
```

---

TITLE: Define Simple Custom Utilities with Tailwind's @utility
DESCRIPTION: Shows how to create basic custom utility classes (e.g., `content-auto`) using the `@utility` directive for CSS features not included by default, and how to use them in HTML.

SOURCE: https://tailwindcss.com/docs/adding-custom-styles

LANGUAGE: CSS
CODE:

```
@utility content-auto {
  content-visibility: auto;
}
```

LANGUAGE: HTML
CODE:

```
<div class="content-auto">
  <!-- ... -->
</div>
```

LANGUAGE: HTML
CODE:

```
<div class="hover:content-auto">
  <!-- ... -->
</div>
```

---

TITLE: Apply border-x-amber-900 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-amber-900` Tailwind CSS utility class. This utility sets the logical inline start and end borders to an extremely dark shade of amber.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-amber-900
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
```

---

TITLE: Apply Transform Origin with CSS Variable in Tailwind CSS
DESCRIPTION: This example illustrates the use of the `origin-(<custom-property>)` syntax in Tailwind CSS to set the `transform-origin` based on a CSS variable. This provides a flexible way to dynamically control the origin point, often used for theme-based or JavaScript-driven transformations.

SOURCE: https://tailwindcss.com/docs/transform-origin

LANGUAGE: HTML
CODE:

```
<img class="origin-(--my-transform-origin) ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Responsive Rotation in Tailwind CSS
DESCRIPTION: This example illustrates how to apply different rotation values based on screen size using responsive variants like `md:` in Tailwind CSS. The element rotates 45 degrees by default and 60 degrees on medium screens and above.

SOURCE: https://tailwindcss.com/docs/rotate

LANGUAGE: HTML
CODE:

```
<img class="rotate-45 md:rotate-60 ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply and reset multiple font-variant-numeric utilities in Tailwind CSS
DESCRIPTION: This example demonstrates how to combine multiple `font-variant-numeric` utilities on an HTML element, such as `slashed-zero` and `tabular-nums`. It also shows how to reset these variants to `normal-nums` at a specific breakpoint (e.g., medium screens and above) using responsive prefixes.

SOURCE: https://tailwindcss.com/docs/font-variant-numeric

LANGUAGE: HTML
CODE:

```
<p class="slashed-zero tabular-nums md:normal-nums ...">  <!-- ... --></p>
```

---

TITLE: Apply custom CSS variable skew value with Tailwind CSS
DESCRIPTION: This example shows how to use a CSS variable to define a custom skew value in Tailwind CSS. The `skew-(<custom-property>)` syntax automatically wraps the custom property in `var()`, allowing dynamic skew values.

SOURCE: https://tailwindcss.com/docs/skew

LANGUAGE: HTML
CODE:

```
<img class="skew-(--my-skew) ..." src="/img/mountains.jpg" />
```

---

TITLE: Applying Responsive Mask Types with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply different mask types based on screen size using Tailwind CSS utility classes. The `mask-type-alpha` class is applied by default, and `md:mask-type-luminance` overrides it for medium screens and above, applying `mask-type: luminance;`.

SOURCE: https://tailwindcss.com/docs/mask-type

LANGUAGE: HTML
CODE:

```
<mask class="mask-type-alpha md:mask-type-luminance ...">  <!-- ... --></mask>
```

---

TITLE: Set Responsive Text Decoration Colors with Tailwind CSS
DESCRIPTION: This example illustrates how to apply different text decoration colors based on screen size using Tailwind CSS's responsive variants. By prefixing utilities with breakpoint variants like `md:`, you can control the `text-decoration-color` property for specific screen dimensions, ensuring adaptive styling across devices.

SOURCE: https://tailwindcss.com/docs/text-decoration-color

LANGUAGE: HTML
CODE:

```
<p class="underline decoration-sky-600 md:decoration-blue-400 ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Customize Tailwind CSS Theme for Numeric Letter Spacing Scale
DESCRIPTION: This example demonstrates how to define a custom numeric letter spacing scale within the Tailwind CSS theme. It also shows how to apply a negative tracking value using a class derived from this custom scale.

SOURCE: https://tailwindcss.com/docs/letter-spacing

LANGUAGE: CSS
CODE:

```
@theme {
  --tracking-1: 0em;
  --tracking-2: 0.025em;
  --tracking-3: 0.05em;
  --tracking-4: 0.1em;
}
```

LANGUAGE: HTML
CODE:

```
<p class="-tracking-2">The quick brown fox ...</p>
```

---

TITLE: Apply Responsive Transition Duration with Tailwind CSS
DESCRIPTION: Shows how to conditionally apply different transition durations based on screen size using Tailwind CSS's responsive variants, such as `md:duration-150`.

SOURCE: https://tailwindcss.com/docs/transition-duration

LANGUAGE: HTML
CODE:

```
<button class="duration-0 md:duration-150 ...">  <!-- ... --></button>
```

---

TITLE: Apply Custom Transform Origin Value in Tailwind CSS
DESCRIPTION: This example demonstrates how to use the `origin-[<value>]` syntax in Tailwind CSS to set a custom `transform-origin` for an HTML element. This allows for precise control over the transformation pivot point using arbitrary values like percentages or pixel values.

SOURCE: https://tailwindcss.com/docs/transform-origin

LANGUAGE: HTML
CODE:

```
<img class="origin-[33%_75%] ..." src="/img/mountains.jpg" />
```

---

TITLE: Remove Tailwind CSS perspective transform
DESCRIPTION: This example demonstrates how to remove any applied perspective transform from an HTML element. It utilizes the `perspective-none` utility class provided by Tailwind CSS to achieve this effect, effectively flattening the 3D space for the element.

SOURCE: https://tailwindcss.com/docs/perspective

LANGUAGE: HTML
CODE:

```
<div class="perspective-none ...">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Tailwind CSS caption-side Utilities to HTML Table Captions
DESCRIPTION: This example demonstrates how to use Tailwind CSS `caption-top` and `caption-bottom` utilities to control the vertical alignment of a table caption. It also shows how to apply these utilities responsively using breakpoint variants, such as `md:caption-bottom`, to change the caption's position based on screen size.

SOURCE: https://tailwindcss.com/docs/caption-side

LANGUAGE: HTML
CODE:

```
<caption class="caption-top md:caption-bottom ...">  <!-- ... --></caption>
```

---

TITLE: Apply border-x-orange-900 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-orange-900` Tailwind CSS utility class. This utility sets the logical inline start and end borders to an extremely dark shade of orange.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-orange-900
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
```

---

TITLE: Apply responsive flex-wrap behavior with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply `flex-wrap` utilities conditionally based on screen size using Tailwind CSS responsive variants. The `md:flex-wrap-reverse` class will only apply the `flex-wrap: wrap-reverse;` style at medium screen sizes and above, overriding the default `flex-wrap` behavior.

SOURCE: https://tailwindcss.com/docs/flex-wrap

LANGUAGE: HTML
CODE:

```
<div class="flex flex-wrap md:flex-wrap-reverse ...">  <!-- ... --></div>
```

---

TITLE: Default Tailwind CSS Import Structure with Preflight
DESCRIPTION: This code block illustrates the default import structure when using `@import "tailwindcss";`. It defines CSS layers for `theme`, `base`, `components`, and `utilities`, and then imports individual Tailwind CSS files into their respective layers, including `preflight.css` for base styles. This serves as a reference for understanding how Tailwind CSS is composed.

SOURCE: https://tailwindcss.com/docs/preflight

LANGUAGE: CSS
CODE:

```
@layer theme, base, components, utilities;@import "tailwindcss/theme.css" layer(theme);@import "tailwindcss/preflight.css" layer(base);@import "tailwindcss/utilities.css" layer(utilities);
```

---

TITLE: Apply Left-Origin Mask Image (From)
DESCRIPTION: These Tailwind CSS utilities generate a `mask-image` property with a linear gradient originating from the left. They define the starting point of the mask using a number, percentage, color, custom CSS property, or an arbitrary value, fading to transparent towards the right.

SOURCE: https://tailwindcss.com/docs/mask-image

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to left, black calc(var(--spacing) * <number>), transparent var(--tw-mask-left-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to left, black <percentage>, transparent var(--tw-mask-left-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to left, <color> var(--tw-mask-left-from), transparent var(--tw-mask-left-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to left, black var(<custom-property>), transparent var(--tw-mask-left-to));
```

LANGUAGE: css
CODE:

```
mask-image: linear-gradient(to left, black <value>, transparent var(--tw-mask-left-to));
```

---

TITLE: Apply border-x-yellow-900 utility (Tailwind CSS)
DESCRIPTION: Applies the `border-inline-color` CSS property using the `border-x-yellow-900` Tailwind CSS utility class. This utility sets the logical inline start and end borders to an extremely dark shade of yellow.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: Tailwind CSS
CODE:

```
border-x-yellow-900
```

LANGUAGE: CSS
CODE:

```
border-inline-color: var(--color-yellow-900); /* oklch(42.1% 0.095 57.708) */
```

---

TITLE: Add Custom Tailwind CSS with Play CDN
DESCRIPTION: This snippet illustrates how to add custom CSS rules that leverage Tailwind's features when using the Play CDN. By setting type="text/tailwindcss" on a <style> tag, you can define custom themes or styles that integrate seamlessly with Tailwind's utility classes.

SOURCE: https://tailwindcss.com/docs/installation/play-cdn

LANGUAGE: HTML
CODE:

```
<!doctype html><html>  <head>    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>    <style type="text/tailwindcss">      @theme {        --color-clifford: #da373d;      }    </style>  </head>  <body>    <h1 class="text-3xl font-bold underline text-clifford">      Hello world!    </h1>  </body></html>
```

---

TITLE: Tailwind CSS Hardware Acceleration for Transforms
DESCRIPTION: Utilize `transform-gpu` to force hardware acceleration for smoother transitions and animations, offloading rendering to the GPU. Use `transform-cpu` to revert to CPU rendering if needed.

SOURCE: https://tailwindcss.com/docs/transform

LANGUAGE: HTML
CODE:

```
<div class="scale-150 transform-gpu">  <!-- ... --></div>
```

---

TITLE: Apply Custom flex-shrink Values in Tailwind CSS
DESCRIPTION: Demonstrates how to use arbitrary values or CSS custom properties with the `flex-shrink` utility in Tailwind CSS to define custom shrinking behavior for flex items. This allows for dynamic or calculated shrink factors beyond the default options.

SOURCE: https://tailwindcss.com/docs/flex-shrink

LANGUAGE: html
CODE:

```
<div class="shrink-[calc(100vw-var(--sidebar))] ...">  <!-- ... --></div>
```

LANGUAGE: html
CODE:

```
<div class="shrink-(--my-shrink) ...">  <!-- ... --></div>
```

---

TITLE: Tailwind CSS `transition-property` Utility Class Reference
DESCRIPTION: Reference table detailing the CSS properties applied by various Tailwind CSS `transition-property` utility classes, including `transition`, `transition-all`, `transition-colors`, `transition-opacity`, `transition-shadow`, `transition-transform`, `transition-none`, and custom value syntax.

SOURCE: https://tailwindcss.com/docs/transition-property

LANGUAGE: CSS
CODE:

```
/* transition */
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-all */
transition-property: all; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-colors */
transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-opacity */
transition-property: opacity; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-shadow */
transition-property: box-shadow; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-transform */
transition-property: transform, translate, scale, rotate; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-none */
transition-property: none;
```

LANGUAGE: CSS
CODE:

```
/* transition-(<custom-property>) */
transition-property: var(<custom-property>); transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

LANGUAGE: CSS
CODE:

```
/* transition-[<value>] */
transition-property: <value>; transition-timing-function: var(--default-transition-timing-function); /* cubic-bezier(0.4, 0, 0.2, 1) */ transition-duration: var(--default-transition-duration); /* 150ms */
```

---

TITLE: Tailwind CSS: Responsive grid-auto-columns
DESCRIPTION: This code demonstrates how to apply `grid-auto-columns` utilities conditionally based on screen size. By prefixing with a breakpoint variant like `md:`, different column sizing can be achieved for various responsive layouts.

SOURCE: https://tailwindcss.com/docs/grid-auto-columns

LANGUAGE: HTML
CODE:

```
<div class="grid grid-flow-col auto-cols-max md:auto-cols-min ...">  <!-- ... --></div>
```

---

TITLE: Apply basic break-before utilities in HTML with Tailwind CSS
DESCRIPTION: Demonstrates how to use `break-before-column` to force a column break before an element within a multi-column layout, affecting the flow of content.

SOURCE: https://tailwindcss.com/docs/break-before

LANGUAGE: HTML
CODE:

```
<div class="columns-2">  <p>Well, let me tell you something, ...</p>  <p class="break-before-column">Sure, go ahead, laugh...</p>  <p>Maybe we can live without...</p>  <p>Look. If you think this is...</p></div>
```

---

TITLE: Apply custom numeric skew value with Tailwind CSS
DESCRIPTION: This example demonstrates how to apply a custom numeric skew value to an HTML element using Tailwind CSS's arbitrary value syntax. The `skew-[<value>]` utility allows specifying any valid CSS skew value, such as `3.142rad` for radians.

SOURCE: https://tailwindcss.com/docs/skew

LANGUAGE: HTML
CODE:

```
<img class="skew-[3.142rad] ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply custom font-stretch values and CSS variables in Tailwind CSS
DESCRIPTION: This example demonstrates how to use arbitrary values and CSS custom properties to set the `font-stretch` property in Tailwind CSS. The `font-stretch-[<value>]` syntax allows for any valid CSS value, while `font-stretch-(<custom-property>)` provides a shorthand for using CSS variables.

SOURCE: https://tailwindcss.com/docs/font-stretch

LANGUAGE: HTML
CODE:

```
<p class="font-stretch-[66.66%] ...">  Lorem ipsum dolor sit amet...</p>
```

LANGUAGE: HTML
CODE:

```
<p class="font-stretch-(--my-font-width) ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Border Top Colors with Tailwind CSS
DESCRIPTION: This snippet demonstrates various Tailwind CSS utility classes for setting the `border-top-color` property. It includes examples for predefined color palettes (zinc, neutral, stone), custom CSS variables, and arbitrary values. Each entry shows the Tailwind class and its corresponding CSS output.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-zinc-700 */
border-top-color: var(--color-zinc-700);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-zinc-800 */
border-top-color: var(--color-zinc-800);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-zinc-900 */
border-top-color: var(--color-zinc-900);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-zinc-950 */
border-top-color: var(--color-zinc-950);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-50 */
border-top-color: var(--color-neutral-50);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-100 */
border-top-color: var(--color-neutral-100);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-200 */
border-top-color: var(--color-neutral-200);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-300 */
border-top-color: var(--color-neutral-300);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-400 */
border-top-color: var(--color-neutral-400);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-500 */
border-top-color: var(--color-neutral-500);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-600 */
border-top-color: var(--color-neutral-600);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-700 */
border-top-color: var(--color-neutral-700);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-800 */
border-top-color: var(--color-neutral-800);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-900 */
border-top-color: var(--color-neutral-900);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-neutral-950 */
border-top-color: var(--color-neutral-950);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-50 */
border-top-color: var(--color-stone-50);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-100 */
border-top-color: var(--color-stone-100);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-200 */
border-top-color: var(--color-stone-200);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-300 */
border-top-color: var(--color-stone-300);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-400 */
border-top-color: var(--color-stone-400);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-500 */
border-top-color: var(--color-stone-500);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-600 */
border-top-color: var(--color-stone-600);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-700 */
border-top-color: var(--color-stone-700);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-800 */
border-top-color: var(--color-stone-800);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-900 */
border-top-color: var(--color-stone-900);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-stone-950 */
border-top-color: var(--color-stone-950);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-(<custom-property>) */
border-top-color: var(<custom-property>);
```

LANGUAGE: css
CODE:

```
/* Tailwind Class: border-t-[<value>] */
border-top-color: <value>;
```

---

TITLE: Set Custom Z-index Value with `z-[<value>]` in Tailwind CSS
DESCRIPTION: Use the `z-[<value>]` syntax to set a completely custom stack order value for an element. This example demonstrates using a `calc()` function within the custom value to dynamically determine the z-index.

SOURCE: https://tailwindcss.com/docs/z-index

LANGUAGE: HTML
CODE:

```
<div class="z-[calc(var(--index)+1)] ...">  <!-- ... --></div>
```

---

TITLE: Tailwind CSS Height and Size Utility Classes Reference
DESCRIPTION: A comprehensive reference of Tailwind CSS utility classes for setting element height and size, including fixed values, percentages, viewport units, and custom properties, along with their corresponding CSS properties.

SOURCE: https://tailwindcss.com/docs/height

LANGUAGE: CSS
CODE:

```
h-<number>: height: calc(var(--spacing) * <number>);
h-<fraction>: height: calc(<fraction> * 100%);
h-auto: height: auto;
h-px: height: 1px;
h-full: height: 100%;
h-screen: height: 100vh;
h-dvh: height: 100dvh;
h-dvw: height: 100dvw;
h-lvh: height: 100lvh;
h-lvw: height: 100lvw;
h-svh: height: 100svh;
h-svw: height: 100svw;
h-min: height: min-content;
h-max: height: max-content;
h-fit: height: fit-content;
h-lh: height: 1lh;
h-(<custom-property>): height: var(<custom-property>);
h-[<value>]: height: <value>;
size-<number>: width: calc(var(--spacing) * <number>); height: calc(var(--spacing) * <number>);
size-<fraction>: width: calc(<fraction> * 100%); height: calc(<fraction> * 100%);
size-auto: width: auto; height: auto;
size-px: width: 1px; height: 1px;
size-full: width: 100%; height: 100%;
size-dvw: width: 100dvw; height: 100dvw;
size-dvh: width: 100dvh; height: 100dvh;
size-lvw: width: 100lvw; height: 100lvw;
size-lvh: width: 100lvh; height: 100lvh;
size-svw: width: 100svw; height: 100svw;
size-svh: width: 100svh; height: 100svh;
size-min: width: min-content; height: min-content;
size-max: width: max-content; height: max-content;
size-fit: width: fit-content; height: fit-content;
size-(<custom-property>): width: var(<custom-property>); height: var(<custom-property>);
size-[<value>]: width: <value>; height: <value>;
```

---

TITLE: Applying Responsive Clear Utilities in Tailwind CSS
DESCRIPTION: This snippet demonstrates how to apply Tailwind CSS `clear` utilities to an HTML element, specifically showing how to use `clear-left` and how to make a utility responsive by prefixing it with a breakpoint variant like `md:clear-none`. This allows the clear property to be disabled or changed at specific screen sizes.

SOURCE: https://tailwindcss.com/docs/clear

LANGUAGE: HTML
CODE:

```
<p class="clear-left md:clear-none ...">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Applying Tailwind CSS Theme Variables in Arbitrary Values
DESCRIPTION: Illustrates how to incorporate theme variables into arbitrary values, often in conjunction with CSS functions like `calc()`. The example shows subtracting 1px from a `--radius-xl` variable to create a concentric border radius on a nested element, ensuring precise visual alignment.

SOURCE: https://tailwindcss.com/docs/theme

LANGUAGE: HTML
CODE:

```
<div class="relative rounded-xl">  <div class="absolute inset-px rounded-[calc(var(--radius-xl)-1px)]">    <!-- ... -->  </div>  <!-- ... --></div>
```

---

TITLE: Customize Text Shadow Colors in Tailwind CSS Theme
DESCRIPTION: This example demonstrates how to add custom color definitions to your Tailwind CSS theme using `--color-*` variables. These custom colors can then be applied to text shadows, allowing for a wider range of color options beyond the default palette.

SOURCE: https://tailwindcss.com/docs/text-shadow

LANGUAGE: CSS
CODE:

```
@theme {  --color-regal-blue: #243c5a; }
```

LANGUAGE: HTML
CODE:

```
<p class="text-shadow-regal-blue">  Lorem ipsum dolor sit amet...</p>
```

---

TITLE: Apply Tailwind CSS arbitrary `group-*` variants
DESCRIPTION: Illustrates how to use arbitrary values within `group-*` variants to style elements based on custom selectors on a parent element. This example shows how to conditionally display content based on a custom class (`is-published`) applied to the parent `group`.

SOURCE: https://tailwindcss.com/docs/hover-focus-and-other-states

LANGUAGE: HTML
CODE:

```
<div class="group is-published">  <div class="hidden group-[.is-published]:block">    Published  </div></div>
```

---

TITLE: Use Custom Theme Easing Utility in HTML
DESCRIPTION: Demonstrates how to apply a custom transition timing function, previously defined in the Tailwind CSS theme, to an HTML element using its corresponding utility class.

SOURCE: https://tailwindcss.com/docs/transition-timing-function

LANGUAGE: HTML
CODE:

```
<button class="ease-in-expo">  <!-- ... --></button>
```

---

TITLE: Overriding Tailwind CSS Preflight Border Styles
DESCRIPTION: In cases where Preflight's border resets conflict with third-party libraries, you can override them with custom CSS. This example shows how to remove border styles for elements within a specific class, such as a Google Map container.

SOURCE: https://tailwindcss.com/docs/preflight

LANGUAGE: CSS
CODE:

```
@layer base {  .google-map * {    border-style: none;  }}
```

---

TITLE: Apply Custom Tailwind CSS Color Utility in HTML
DESCRIPTION: This example shows how to apply a custom color utility, `outline-regal-blue`, to an HTML element. This utility leverages a previously defined custom theme color variable to style the element's outline, demonstrating the integration of custom theme colors into markup.

SOURCE: https://tailwindcss.com/docs/outline-color

LANGUAGE: HTML
CODE:

```
<div class="outline-regal-blue">  <!-- ... --></div>
```

---

TITLE: Apply Responsive Background Repeat Utilities in HTML
DESCRIPTION: Demonstrates how to apply responsive background repeat utilities using Tailwind CSS classes in an HTML div element. It shows how to set a default repeat behavior and override it for medium screen sizes and above.

SOURCE: https://tailwindcss.com/docs/background-repeat

LANGUAGE: HTML
CODE:

```
<div class="bg-repeat md:bg-repeat-x ...">  <!-- ... --></div>
```

---

TITLE: Apply Text Shadow Utilities in Tailwind CSS
DESCRIPTION: This section lists the Tailwind CSS utility classes available for applying text shadows to elements. Each class directly translates to a specific CSS `text-shadow` property, allowing developers to easily control the shadow's size, blur, and color. The examples include various predefined shadow scales, a 'none' option to remove shadows, and utilities for setting custom shadow values or specific shadow colors using Tailwind's color palette.

SOURCE: https://tailwindcss.com/docs/text-shadow

LANGUAGE: CSS
CODE:

```
text-shadow: var(--text-shadow-2xs); /* 0px 1px 0px rgb(0 0 0 / 0.15) */
```

LANGUAGE: CSS
CODE:

```
text-shadow: var(--text-shadow-xs); /* 0px 1px 1px rgb(0 0 0 / 0.2) */
```

LANGUAGE: CSS
CODE:

```
text-shadow: var(--text-shadow-sm); /* 0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075) */
```

LANGUAGE: CSS
CODE:

```
text-shadow: var(--text-shadow-md); /* 0px 1px 1px rgb(0 0 0 / 0.1), 0px 1px 2px rgb(0 0 0 / 0.1), 0px 2px 4px rgb(0 0 0 / 0.1) */
```

LANGUAGE: CSS
CODE:

```
text-shadow: var(--text-shadow-lg); /* 0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1) */
```

LANGUAGE: CSS
CODE:

```
text-shadow: none;
```

LANGUAGE: CSS
CODE:

```
text-shadow: var(<custom-property>);
```

LANGUAGE: CSS
CODE:

```
--tw-shadow-color var(<custom-property>);
```

LANGUAGE: CSS
CODE:

```
text-shadow: <value>;
```

LANGUAGE: CSS
CODE:

```
--tw-shadow-color inherit;
```

LANGUAGE: CSS
CODE:

```
--tw-shadow-color currentColor;
```

LANGUAGE: CSS
CODE:

```
--tw-shadow-color transparent;
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-black); /* #000 */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-white); /* #fff */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-50); /* oklch(97.1% 0.013 17.38) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-100); /* oklch(93.6% 0.032 17.717) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-200); /* oklch(88.5% 0.062 18.334) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-300); /* oklch(80.8% 0.114 19.571) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-400); /* oklch(70.4% 0.191 22.216) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-500); /* oklch(63.7% 0.237 25.331) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-600); /* oklch(57.7% 0.245 27.325) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-700); /* oklch(50.5% 0.213 27.518) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-800); /* oklch(44.4% 0.177 26.899) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-900); /* oklch(39.6% 0.141 25.723) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-red-950); /* oklch(25.8% 0.092 26.042) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-50); /* oklch(98% 0.016 73.684) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-100); /* oklch(95.4% 0.038 75.164) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-200); /* oklch(90.1% 0.076 70.697) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-300); /* oklch(83.7% 0.128 66.29) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-400); /* oklch(75% 0.183 55.934) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-500); /* oklch(70.5% 0.213 47.604) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-600); /* oklch(64.6% 0.222 41.116) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-700); /* oklch(55.3% 0.195 38.402) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-800); /* oklch(47% 0.157 37.304) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-900); /* oklch(40.8% 0.123 38.172) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-orange-950); /* oklch(26.6% 0.079 36.259) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-50); /* oklch(98.7% 0.022 95.277) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-100); /* oklch(96.2% 0.059 95.617) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-200); /* oklch(92.4% 0.12 95.746) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-300); /* oklch(87.9% 0.169 91.605) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-400); /* oklch(82.8% 0.189 84.429) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-500); /* oklch(76.9% 0.188 70.08) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-600); /* oklch(66.6% 0.179 58.318) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-700); /* oklch(55.5% 0.163 48.998) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-800); /* oklch(47.3% 0.137 46.201) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-900); /* oklch(41.4% 0.112 45.904) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-amber-950); /* oklch(27.9% 0.077 45.635) */
```

LANGUAGE: CSS
CODE:

```
--tw-text-shadow-color var(--color-yellow-50); /* oklch(98.7% 0.026 102.212) */
```

---

TITLE: Tailwind CSS: Custom Backdrop Brightness Value
DESCRIPTION: Demonstrates applying a specific, custom backdrop brightness value using the arbitrary value syntax `backdrop-brightness-[<value>]` in Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/backdrop-filter-brightness

LANGUAGE: HTML
CODE:

```
<div class="backdrop-brightness-[1.75] ...">  <!-- ... --></div>
```

---

TITLE: Avoiding dynamic class name construction in HTML
DESCRIPTION: Tailwind cannot understand string concatenation or interpolation. Constructing class names dynamically, as shown in this HTML example, will prevent Tailwind from detecting the full class names (e.g., 'text-red-600' or 'text-green-600') because they don't exist as complete strings in the source.

SOURCE: https://tailwindcss.com/docs/detecting-classes-in-source-files

LANGUAGE: HTML
CODE:

```
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

---

TITLE: Tailwind CSS Fill Color Utilities
DESCRIPTION: This collection demonstrates the CSS output generated by various Tailwind CSS `fill` utility classes. Each entry shows a specific `fill` property value, typically referencing a CSS variable for a predefined color from the Tailwind palette, along with its `oklch` color space representation as a comment.

SOURCE: https://tailwindcss.com/docs/fill

LANGUAGE: CSS
CODE:

```
fill: var(--color-pink-700); /* oklch(52.5% 0.223 3.958) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-pink-800); /* oklch(45.9% 0.187 3.815) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-pink-900); /* oklch(40.8% 0.153 2.432) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-pink-950); /* oklch(28.4% 0.109 3.907) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-50); /* oklch(96.9% 0.015 12.422) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-100); /* oklch(94.1% 0.03 12.58) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-200); /* oklch(89.2% 0.058 10.001) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-300); /* oklch(81% 0.117 11.638) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-400); /* oklch(71.2% 0.194 13.428) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-500); /* oklch(64.5% 0.246 16.439) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-600); /* oklch(58.6% 0.253 17.585) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-700); /* oklch(51.4% 0.222 16.935) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-800); /* oklch(45.5% 0.188 13.697) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-900); /* oklch(41% 0.159 10.272) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-rose-950); /* oklch(27.1% 0.105 12.094) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-50); /* oklch(98.4% 0.003 247.858) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-100); /* oklch(96.8% 0.007 247.896) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-200); /* oklch(92.9% 0.013 255.508) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-300); /* oklch(86.9% 0.022 252.894) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-400); /* oklch(70.4% 0.04 256.788) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-500); /* oklch(55.4% 0.046 257.417) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-600); /* oklch(44.6% 0.043 257.281) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-700); /* oklch(37.2% 0.044 257.287) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-800); /* oklch(27.9% 0.041 260.031) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-900); /* oklch(20.8% 0.042 265.755) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-slate-950); /* oklch(12.9% 0.042 264.695) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-50); /* oklch(98.5% 0.002 247.839) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-100); /* oklch(96.7% 0.003 264.542) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-200); /* oklch(92.8% 0.006 264.531) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-300); /* oklch(87.2% 0.01 258.338) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-400); /* oklch(70.7% 0.022 261.325) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-500); /* oklch(55.1% 0.027 264.364) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-600); /* oklch(44.6% 0.03 256.802) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-700); /* oklch(37.3% 0.034 259.733) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-800); /* oklch(27.8% 0.033 256.848) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-900); /* oklch(21% 0.034 264.665) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-gray-950); /* oklch(13% 0.028 261.692) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-50); /* oklch(98.5% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-100); /* oklch(96.7% 0.001 286.375) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-200); /* oklch(92% 0.004 286.32) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-300); /* oklch(87.1% 0.006 286.286) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-400); /* oklch(70.5% 0.015 286.067) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-500); /* oklch(55.2% 0.016 285.938) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-600); /* oklch(44.2% 0.017 285.786) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-700); /* oklch(37% 0.013 285.805) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-800); /* oklch(27.4% 0.006 286.033) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-900); /* oklch(21% 0.006 285.885) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-zinc-950); /* oklch(14.1% 0.005 285.823) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-50); /* oklch(98.5% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-100); /* oklch(97% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-200); /* oklch(92.2% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-300); /* oklch(87% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-400); /* oklch(70.8% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-500); /* oklch(55.6% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-600); /* oklch(43.9% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-700); /* oklch(37.1% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-800); /* oklch(26.9% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-900); /* oklch(20.5% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-neutral-950); /* oklch(14.5% 0 0) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-stone-50); /* oklch(98.5% 0.001 106.423) */
```

LANGUAGE: CSS
CODE:

```
fill: var(--color-stone-100); /* oklch(97% 0.001 106.424) */
```

---

TITLE: Prefixing Tailwind CSS Classes to Avoid Conflicts
DESCRIPTION: To prevent class name conflicts with existing CSS in a project, Tailwind CSS offers a `prefix` option that can be specified in the `@import` directive. This option adds a custom prefix to all Tailwind-generated classes and CSS variables, ensuring unique naming. For example, using `prefix(tw)` would transform `.text-red-500` into `.tw:text-red-500`.

SOURCE: https://tailwindcss.com/docs/styling-with-utility-classes

LANGUAGE: CSS
CODE:

```
@import "tailwindcss" prefix(tw);
```

LANGUAGE: CSS
CODE:

```
@layer theme {
  :root {
    --tw-color-red-500: oklch(0.637 0.237 25.331);
  }}
@layer utilities {
  .tw\:text-red-500 {
    color: var(--tw-color-red-500);
  }
}
```

---

TITLE: Apply responsive outline-style with Tailwind CSS
DESCRIPTION: Demonstrates how to apply `outline-style` utilities conditionally based on screen size using responsive variants like `md:` in Tailwind CSS. This allows for different outline styles on various breakpoints, ensuring adaptive design.

SOURCE: https://tailwindcss.com/docs/outline-style

LANGUAGE: HTML
CODE:

```
<div class="outline md:outline-dashed ...">  <!-- ... --></div>
```

---

TITLE: Update Tailwind CSS Shadow, Radius, and Blur Scales (v3 to v4)
DESCRIPTION: Tailwind CSS v4 renames default shadow, radius, and blur scales for consistent naming. The `_<utility>_-sm` utilities are now `_<utility>_-xs`. This snippet shows how to update HTML classes from the old `shadow-sm` to the new `shadow-xs` or `shadow` for backward compatibility.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: HTML
CODE:

```
<input class="shadow-sm" /><input class="shadow-xs" /><input class="shadow" /><input class="shadow-sm" />
```

---

TITLE: Load Tailwind CSS v4 JavaScript Config Explicitly
DESCRIPTION: States that JavaScript config files are no longer automatically detected in Tailwind CSS v4 for backward compatibility. If a JavaScript config file is still needed, it must be explicitly loaded using the `@config` directive within a CSS file. Notes that certain options from JS config are no longer supported.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: CSS
CODE:

```
@config "../../tailwind.config.js";
```

---

TITLE: Apply Custom Scale Value with Tailwind CSS
DESCRIPTION: Demonstrates how to use arbitrary values with the `scale-[<value>]` syntax to set a custom scale for an image element in Tailwind CSS.

SOURCE: https://tailwindcss.com/docs/scale

LANGUAGE: HTML
CODE:

```
<img class="scale-[1.7] ..." src="/img/mountains.jpg" />
```

---

TITLE: Apply Custom CSS Variable for Transition Timing in HTML
DESCRIPTION: Illustrates using the `ease-(<custom-property>)` syntax to apply a custom CSS variable as the `transition-timing-function` for an HTML element, automatically wrapping it in `var()`.

SOURCE: https://tailwindcss.com/docs/transition-timing-function

LANGUAGE: HTML
CODE:

```
<button class="ease-(--my-ease) ...">  <!-- ... --></button>
```

---

TITLE: Directly use Tailwind CSS theme variables in Vue/Svelte/CSS Modules
DESCRIPTION: For improved performance in Tailwind CSS v4, you can directly use CSS theme variables (e.g., `var(--text-red-500)`) in your stylesheets instead of relying on `@apply`. This approach bypasses Tailwind's processing for those specific styles.

SOURCE: https://tailwindcss.com/docs/upgrade-guide

LANGUAGE: Vue
CODE:

```
<template>  <h1>Hello world!</h1></template><style>  h1 {    color: var(--text-red-500);  }</style>
```

---

TITLE: Extending Tailwind CSS Theme with Custom Font
DESCRIPTION: This example demonstrates how to extend the default Tailwind CSS theme by defining a new custom font variable (`--font-script`) within the `@theme` block in a CSS file. This makes a new `font-script` utility class available for use.

SOURCE: https://tailwindcss.com/docs/theme

LANGUAGE: CSS
CODE:

```
@import "tailwindcss";@theme {  --font-script: Great Vibes, cursive;}
```

---

TITLE: Apply Indigo 700 Border Inline Color with TailwindCSS
DESCRIPTION: Applies `border-inline-color: var(--color-indigo-700);` to an element using the TailwindCSS utility class `border-x-indigo-700`. This sets the border color on the logical inline start and end sides of an element, providing a deep indigo shade.

SOURCE: https://tailwindcss.com/docs/border-color

LANGUAGE: tailwindcss
CODE:

```
border-x-indigo-700
```

LANGUAGE: css
CODE:

```
border-inline-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
```
