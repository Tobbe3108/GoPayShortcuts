# Food Shortcuts App - Copilot Instructions

## Project Overview

A static Svelte webapp that provides usefull shortcuts to features from a bad Food ordering app. The app should be lightweight, responsive, and easy to use.

## General Guidelines

- Basicaly dont write any code comments
- Only write comments to explain strange or very complicated code
- Write self-documenting code with descriptive names
- Use idiomatic patterns for each technology
- Ensure clear and maintainable code
- Handle errors gracefully at appropriate levels
- Implement logging for important operations and errors
- Write as little code as possible, find and use npm packages over writing your own implementation
- Minimize indenting, prefer extracting things into more classes, methods, components and so on
- Rarely use hardcoded values - only when abselutly necessary
- Write

## Technical Requirements

- Use Svelte
- Use TypeScript for type safety
- Use Tailwind utility classes for all styling
- Use stores for shared state management
- Implement as a static site with no backend requirements that is hosted on Azure static web apps
- Ensure responsive design for mobile and desktop

### Frontend Structure

- Organize components by feature when possible
- Implement responsive design using Tailwind breakpoints
- Keep components small and composable

### Styling Guidelines

- Avoid custom CSS unless absolutely necessary
- Maintain a consistent color scheme

## App Structure

- Login page
  - Logins is a two-step process
    - Step 1: Enter email
    - Step 2: Enter OTP
- Page with shortcut actions

## Sample Shortcuts

- Order food and or drink today
- Order food and or drink all week
- Delete today's orders

When implementing features, prioritize performance and ease of use, as this is meant to be a quick-access utility app.
