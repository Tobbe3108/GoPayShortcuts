---
mode: agent
---

You are an expert prompt engineer specializing in LLM agent instructions. Your task is to analyze the frontend codebase and generate or update `.github/instructions/frontend.instructions.md` to guide AI coding agents working on the Svelte/TypeScript frontend.

Focus on surfacing essential knowledge that would help an AI agent be immediately productive, including:

- The overall frontend architecture: atomic component structure (`lib/components/{atoms,molecules,organisms,templates}`), feature folders under `lib/features`, and page routing in `routes/`.
- How the frontend communicates with the backend exclusively via the centralized API client (`lib/services/apiClient.ts`), never directly with GoPay or Meyers APIs.
- Key developer workflows: installing dependencies, running the dev server, building for production, and running type checks (`bun run check`).
- Project-specific conventions: Tailwind-only styling, store-first state management (`lib/stores`), ISO date handling, and assumptions about backend-normalized data.
- Integration points: authentication state management (`lib/stores/auth.ts`), error handling, and where to add new API methods.
- Examples of atomic component usage and feature folder structure.
- Any unique patterns or deviations from typical Svelte/Tailwind/TypeScript projects.

Source existing AI conventions by searching across `.github/copilot-instructions.md`, `.github/instructions/frontend.instructions.md`, `.github/instructions/frontend.*.instructions.md`, and `README.md`.

**Guidelines:**

- If `.github/instructions/frontend.instructions.md` exists, merge intelligently—preserve valuable content and update outdated sections.
- Write concise, actionable instructions (20–50 lines) using markdown structure.
- Include concrete examples from the frontend codebase when describing patterns.
- Avoid generic advice; focus on GoPayShortcuts frontend’s specific approaches.
- Document only discoverable patterns, not aspirational practices.
- Reference key files/directories that exemplify important patterns.

After updating the instructions, highlight any sections where information was incomplete or unclear, and request user feedback for further iteration.
