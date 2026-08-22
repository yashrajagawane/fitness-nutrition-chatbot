<a name="readme-top"></a>

<div align="center">

# 🏋️ AI Fitness Coach

### An AI-powered fitness and nutrition coach for the browser — and your phone's home screen.

[![Launch App](https://img.shields.io/badge/Launch%20AI%20Fitness%20Coach-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://fitness-nutrition-chatbot.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Authentication-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

**[Preview](#-preview)** · **[Features](#-features)** · **[Tech Stack](#-tech-stack)** · **[Setup](#-local-development)** · **[PWA Guide](#-phone-pwa-experience)**

</div>

---

## 📋 Table of Contents

- [Preview](#-preview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Phone PWA Experience](#-phone-pwa-experience)
- [Quality Checks](#-quality-checks)
- [Roadmap](#-future-improvements)
- [Disclaimer](#️-disclaimer)
- [Author](#-author)

---

## 📸 Preview
 
> Screenshots live in the `screenshots/` folder. Desktop captures sit at the root; mobile captures are prefixed with `mobile-`.
 
### 🖥️ Desktop — Dashboard Experience
 
<p align="center">
<b>AI Coaching Dashboard</b><br/>
<img src="screenshots/ai-fitness-coach-dashboard.png" width="700"/>
</p>
<p align="center">
<b>5-Day Workout Plan</b><br/>
<img src="screenshots/5-day-workout-plan.png" width="700"/>
</p>
<p align="center">
<b>Progress &amp; Saved Plans</b><br/>
<img src="screenshots/progress-and-saved-plans.png" width="700"/>
</p>
### 📱 Mobile — PWA Experience
 
<p align="center">
<img src="screenshots/mobile-ai-fitness-chat.png" width="260"/>
&nbsp;&nbsp;&nbsp;
<img src="screenshots/mobile-5-day-workout-plan.png" width="260"/>
</p>
<p align="center">
<sub><b>AI Coaching Chat</b></sub>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<sub><b>5-Day Workout Plan</b></sub>
</p>
<p align="center">
<img src="screenshots/mobile-navigation-sidebar.png" width="260"/>
&nbsp;&nbsp;&nbsp;
<img src="screenshots/mobile-progress-and-saved-plans.png" width="260"/>
</p>
<p align="center">
<sub><b>Navigation Sidebar</b></sub>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<sub><b>Progress &amp; Saved Plans</b></sub>
</p>
<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## ⚡ Features

### 🧠 AI fitness and nutrition coaching

- Personalized workout, nutrition, recovery, and macro guidance.
- Structured responses with summaries, action plans, and safety notes.
- Fitness-domain guardrails and an educational health disclaimer.
- Markdown rendering and structured workout cards for readable training plans.

### 📱 Phone-first PWA experience

- Works as a normal responsive website on desktop and mobile browsers.
- Installable as a Progressive Web App on supported Android browsers.
- iPhone and iPad users receive **Share → Add to Home Screen** guidance.
- Standalone app metadata, portrait orientation, theme colour, and app icons.
- Production service worker caches only safe application-shell and static assets.
- Offline fallback page for navigation when there is no connection.
- AI, authentication, Supabase, and API requests remain network-only.

### 🎛 Responsive mobile interface

- Hideable mobile sidebar with a dedicated sidebar-open button.
- Mobile header prevents chat-title overlap with the sidebar control.
- Phone-safe bottom spacing so the composer is not hidden by system UI.
- Touch-friendly send button and phone keyboard send hint.
- Scrollable profile and Progress & Plans dialogs.
- First-time visitors enter the dashboard directly; completing a profile is optional.

### 👤 Profile, authentication, and privacy

- Optional profile: age, height, weight, goal, activity, equipment, schedule, diet preferences, and limitations.
- Saved profile details are included in the AI context for more relevant responses.
- Simple Supabase email sign-up, sign-in, and sign-out flow when configured.
- Browser storage keeps sessions, profiles, plans, and progress private by default.
- Export/import JSON backup and delete local data controls.

### 🗂 Consultations, plans, and progress

- Create, switch, and delete consultation sessions.
- Save useful coach responses as plans.
- Share saved plans with the native phone share sheet, with clipboard fallback.
- Log workouts, weight, water, sleep, and notes in Progress & Plans.
- Copy responses, regenerate the latest answer, and retry failed messages.

### 🛡 Reliability

- Request validation, rate limiting, request IDs, no-store API responses, and a health endpoint.
- Automated PWA readiness checks validate manifest, icons, offline fallback, and service-worker safety boundaries.

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 🛠 Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 + App Router | Full-stack React application and API routes |
| React 19 | Interactive UI |
| Tailwind CSS | Responsive styling |
| Google Gemini | AI coaching responses |
| Supabase | Optional email authentication |
| React Markdown + Lucide | Rich responses and UI icons |
| Service Worker + Web Manifest | Installable PWA and offline fallback |
| Vercel | Deployment and CI/CD |

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U["Browser or installed PWA"] --> UI["Next.js chat UI"]
    UI --> SW["Service worker\nSafe shell + static cache"]
    UI -->|"POST /api/chat"| API["Next.js API route"]
    API --> G["Google Gemini"]
    UI -. optional auth .-> S["Supabase Auth"]
    UI --> L["Browser local storage\nProfile, sessions, plans, progress"]
```

The service worker does not cache Gemini, Supabase, authentication, or API requests. This keeps private and live data network-only while still allowing a useful offline app shell.

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 📂 Project Structure

```text
app/
├── api/
│   ├── chat/                 # Gemini-backed coaching endpoint
│   └── health/               # Deployment health endpoint
├── components/               # PWA registration and install UI
├── lib/                      # Storage, validation, Supabase helpers
├── offline/                  # Offline fallback route
├── layout.tsx                # Metadata, manifest, PWA wiring
├── manifest.webmanifest      # Install metadata
└── page.tsx                  # Main application UI

public/
├── icons/                    # PWA icons
└── sw.js                     # Safe service worker

scripts/
├── health-check.mjs          # Deployment smoke check
└── verify-pwa.mjs            # PWA readiness check

screenshots/                  # README preview images
supabase/schema.sql           # Supabase database schema
```

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 🚀 Local Development

### 1. Clone and install

```bash
git clone https://github.com/yashrajagawane/fitness-nutrition-chatbot.git
cd fitness-nutrition-chatbot
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key

# Optional: enables Supabase email authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Get a Gemini key from [Google AI Studio](https://aistudio.google.com). For Supabase authentication, create a project, add the two public values above, and run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Verify before deployment

```bash
npm run verify
```

This runs the PWA readiness check, ESLint, TypeScript typecheck, and production build.

### 5. Optional deployment smoke check

```bash
DEPLOYMENT_URL=https://your-deployment.vercel.app npm run smoke
```

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 📲 Phone PWA Experience

### Android

When the browser offers installation, use the in-app **Install app** prompt. It may not appear immediately because browser installation rules apply; it also stays hidden after dismissal or when the app is already installed.

### iPhone and iPad

Open the app in Safari, tap **Share**, then choose **Add to Home Screen**. The app displays this guidance automatically on eligible iOS and iPadOS browsers.

### Offline behaviour

The application shell and static assets can load from the PWA cache. AI coaching, sign-in, Supabase, and data requests still require a connection and are not cached.

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## ✅ Quality Checks

| Command | What it checks |
| --- | --- |
| `npm run pwa:verify` | Required PWA files, manifest metadata, offline fallback wiring, and API-cache bypass |
| `npm run lint` | Code quality |
| `npm run typecheck` | TypeScript correctness |
| `npm run build` | Production build validity |
| `npm run verify` | Runs all of the above, in order |

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## 📈 Future Improvements

- [ ] Sync profiles, saved plans, and progress entries to Supabase per signed-in user.
- [ ] Add ownership checks for cloud-synced data.
- [ ] Add reminders and optional push notifications.
- [ ] Add progress charts and long-term analytics.
- [ ] Complete real-device checks for installation, offline fallback, sharing, and authentication.

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>

---

## ⚠️ Disclaimer

AI Fitness Coach provides general, AI-generated fitness and nutrition education. It is not medical advice and does not replace a certified trainer, registered dietitian, or physician. Consult a qualified professional before beginning a new workout or diet plan, especially if you have an injury, medical condition, or dietary concern.

---

## 👨‍💻 Author

**Yashraj Agawane**

[![GitHub](https://img.shields.io/badge/GitHub-yashrajagawane-181717?style=flat-square&logo=github)](https://github.com/yashrajagawane)

<p align="right"><a href="#readme-top">back to top ⬆️</a></p>
