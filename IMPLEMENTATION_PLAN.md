# AI Fitness Coach — Implementation Plan

## 1. Current Baseline

The project is a Next.js App Router application deployed to Vercel and connected to the GitHub `main` branch. The current application includes:

- A chat interface powered by Gemini through `app/api/chat/route.ts`.
- Fitness profile fields for age, height, weight, gender, goal, and activity level.
- Multiple consultation sessions stored in browser `localStorage`.
- Markdown rendering and workout-plan cards.
- A responsive dark UI with quick-prompt suggestions.
- Production deployment and working Gemini API configuration.

Current technical gaps to account for during implementation:

- User profiles and conversations are browser-only and are lost when local storage is cleared or the user changes device.
- The API accepts loosely shaped request data and does not currently validate message length, history size, or profile values.
- The API returns a complete response; the UI simulates streaming after the response arrives.
- The default page metadata still says `Create Next App`.
- README technology and structure references should be kept synchronized with the actual codebase.
- There are no visible automated unit, integration, or end-to-end tests.

## 2. Product Goals

1. Make the coach more useful for repeat fitness planning, tracking, and adherence.
2. Make generated advice more structured, reliable, safe, and actionable.
3. Preserve a fast, simple experience for unauthenticated visitors.
4. Add durable data storage without exposing private user data unnecessarily.
5. Improve production reliability, observability, accessibility, and maintainability.

## 3. Proposed Feature Roadmap

### Phase 0 — Foundation and Cleanup

- Create shared TypeScript types for profiles, messages, sessions, plans, meals, and progress entries.
- Split the large `app/page.tsx` into focused components and hooks.
- Add schema validation for API requests and persisted client data.
- Replace default metadata and favicon/title references with product branding.
- Add loading, empty, error, retry, and offline states.
- Fix documentation drift in the README, including React version, project structure, and streaming claims.
- Add formatting, lint, type-check, and build scripts to the development workflow.

### Phase 1 — Better Chat and AI Quality

- Use a versioned prompt configuration with separate system instructions and user context.
- Add clear domain guardrails for medical, injury, eating-disorder, medication, and emergency questions.
- Return structured JSON for supported plan types rather than parsing fragile Markdown patterns.
- Add selectable coaching modes: workout, nutrition, recovery, habit coaching, and general fitness.
- Add conversation search, rename, export, and delete confirmation.
- Add regenerate response, edit-and-resend, copy response, and helpful/not-helpful feedback.
- Implement true server-side streaming if the final UX requires progressive generation.
- Handle rate limits, upstream failures, timeouts, malformed model output, and retryable errors consistently.

### Phase 2 — Profiles, Plans, and Tracking

- Add a guided onboarding flow with units, equipment, experience level, schedule, dietary preferences, allergies, injuries, and restrictions.
- Add BMI, calorie, and macro estimates with visible assumptions and an option to override targets.
- Add saved workout plans and meal plans separate from chat history.
- Add a weekly dashboard with workout completion, weight, measurements, calories/macros, water, sleep, and habit tracking.
- Add plan completion checkboxes and simple progress summaries.
- Add reminders and a weekly review prompt, initially as opt-in browser notifications or email integrations.
- Support plan regeneration when goals, equipment, schedule, or restrictions change.

### Phase 3 — Accounts and Durable Data

- Add optional authentication so the current no-account chat flow remains accessible.
- Add a database-backed model for users, profiles, sessions, messages, plans, and progress entries.
- Add user-owned data access rules and server-side authorization checks for every protected record.
- Add import/export of profile and history data.
- Add account deletion and data deletion controls.
- Decide on a privacy policy, retention policy, and whether analytics are opt-in.

### Phase 4 — Production Hardening

- Add API rate limiting and abuse protection.
- Keep Gemini credentials server-side and validate all external responses.
- Add request IDs, structured logs, latency tracking, model failure metrics, and alerting.
- Add automated tests for API validation, prompt context, session persistence, plan parsing, and safety responses.
- Add end-to-end tests for onboarding, chat, profile editing, session management, and error states.
- Add accessibility checks for keyboard navigation, focus management, labels, contrast, screen readers, and reduced motion.
- Verify mobile layouts, slow-network behavior, browser storage failures, and API timeouts.
- Add dependency update and security scanning to CI.
- Configure Vercel preview deployments, production environment variables, custom domain, Web Analytics, and Speed Insights where useful.

## 4. Recommended Priority Order

1. Foundation cleanup, validation, error states, and metadata.
2. Structured AI responses and safety guardrails.
3. Better onboarding and saved plans.
4. Progress tracking dashboard.
5. Optional authentication and database persistence.
6. Rate limiting, observability, automated testing, and accessibility hardening.

This order improves reliability and product quality before introducing the complexity of accounts and a database.

## 5. Suggested Technical Direction

- Keep Next.js App Router and Vercel for the first implementation cycle.
- Use a runtime schema validator such as Zod for API and persisted-data validation.
- Prefer structured model output with a strict schema for workout and meal plans.
- Keep Gemini calls in server-only route handlers or server-side services.
- If persistence is added, use a managed PostgreSQL database with an ORM and explicit ownership checks.
- Use an authentication provider that supports email/passwordless or OAuth without storing credentials directly in the application.
- Introduce a small service layer for AI requests, plan parsing, profile calculations, and persistence.
- Add tests with a lightweight unit runner plus Playwright for critical browser flows.

## 6. Definition of Done for the Overall Upgrade

- A new user can create a profile, ask questions, receive safe structured guidance, save a plan, and return to it.
- A returning authenticated user can access their sessions and progress from another device.
- Invalid input, missing configuration, model failures, rate limits, and network failures produce useful user-facing states.
- Sensitive secrets remain server-side and user data is isolated by authorization checks.
- Core flows have automated test coverage and pass lint, type-check, build, and deployment checks.
- The README, metadata, UI behavior, and deployment configuration accurately describe the product.

## 7. Implementation Tracking

Detailed implementation notes, decisions, file-level tasks, and completion updates will be recorded in [`implementation.md`](./implementation.md) when development begins.
