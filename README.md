# 🏋️ AI Fitness Coach

> **AI-powered fitness & nutrition assistant** — personalized workout plans, diet guidance, and real-time coaching, all in a modern chat interface.

[![Launch App](https://img.shields.io/badge/🚀%20Live%20Demo-AI%20Fitness%20Coach-22c55e?style=for-the-badge)](https://fitness-nutrition-chatbot.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

---

## 📸 Preview

| Profile Setup | Chat Interface | Workout Cards |
|---|---|---|
| ![Profile](screenshots/profile.png) | ![Chat](screenshots/chat.png) | ![Workout](screenshots/workout.png) |

---

## ✨ Features

**🧠 Personalized AI Coaching** — Ask about workout plans, fat loss, muscle gain, macro calculation, recovery, and more. Every response is tailored to your profile.

**🧍 Fitness Profile Memory** — Users set their age, height, weight, gender, fitness goal, and activity level. The AI uses this context for every recommendation.

**💪 Workout Plan Cards** — AI-generated workout plans are automatically rendered as structured visual cards — not raw text.

```
Day 1 — Chest            Day 2 — Back
─────────────────        ─────────────────
Bench Press              Pull Ups
Incline DB Press         Lat Pulldown
Chest Fly                Deadlift
```

**⚡ Streaming Responses** — Real-time AI typing simulation for a fluid, ChatGPT-like experience.

**🗂 Multi-Session Chats** — Create, switch, and delete multiple consultation sessions. State persists via localStorage.

**📝 Markdown Rendering** — Responses render with full formatting: headings, bullets, structured plans, and more.

---

## 🛠 Tech Stack

```
Frontend       Next.js (App Router) · React · TailwindCSS · React Markdown · Lucide Icons
Backend        Next.js API Routes · Gemini API
Deployment     Vercel (CI/CD from GitHub)
```

---

## 🗂 Project Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts          # AI backend route (Gemini integration)
└── page.tsx                  # Main chat UI

components/
└── WorkoutCard.tsx            # Structured workout plan cards
```

---

## ⚙️ Local Setup

```bash
# 1. Clone
git clone https://github.com/yashrajagawane/Fitness-Nutrition-Chatbot.git

# 2. Install
npm install

# 3. Add environment variables
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key from [ai.google.dev](https://ai.google.dev) |

---

## 📈 Roadmap

- [ ] User authentication
- [ ] Saved workout programs & progress tracking
- [ ] AI-generated weekly meal plans
- [ ] User dashboard with fitness analytics
- [ ] Mobile optimization

---

## 🎯 What This Demonstrates

This project showcases **full-stack AI application development** — conversational UI design, AI model integration via API routes, real-time streaming, structured response rendering, and multi-session state management.

---

## 👨‍💻 Author

**Yashraj Agawane** · [GitHub](https://github.com/yashrajagawane)

> ⭐ Star this repo if you find it useful!
