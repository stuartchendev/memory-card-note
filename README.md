## 🧠 Memory Cards

A tiny flashcard web app I built for daily interview practice.

This tool helps me turn engineering decisions into short, speakable one-liners,
and review them regularly before interviews.

#### Demo: https://memory-card-note.netlify.app/

## ✨ Why I built this

When preparing for frontend interviews, I noticed that:
- I often understood a concept, 
- but couldn’t say it clearly under pressure.

So I built this app to:
- capture one-liner answers (especially for React / state design questions),
- review them daily,
- and keep the scope intentionally small, so I actually use it.
This is a personal productivity tool, not a full-featured product.

## 🛠 Tech Stack

- Next.js (App Router)
- React + TypeScript
- Client-side state + localStorage
- No backend, no authentication, no external database

## 🤔 Why Next.js (instead of a simple React SPA)?

I chose Next.js for this project because it lets me practice:

- **File-based routing**:
  - Each folder represents a real user page (/, /cards, /review).

- **Server / Client responsibility boundaries**
  - Pages are server components by default.
  - Card state and localStorage logic live explicitly in client components.

- **Scalable structure without over-engineering**
  - Even though this app is client-only for now, the structure allows future extension
  (API routes, persistence) without refactoring the whole app.

This decision was more about architecture clarity than performance.

## 🧩 Core Features

### Card Management
- Add / delete cards
- Search and filter by topic or confidence level
- Import / export cards as JSON 
### Review Mode
- Random card selection
- Show / hide answer
- Rate confidence: Again / Not sure / I know
### Dashboard
- Quick overview of total cards and confidence distribution
- Fast navigation to manage or review cards

## 🧱 Data Model (Simplified)

Each card represents a single interview-ready thought:

```TS
type Card = {
topic: string;
question: string;
oneLiner: string;
note?: string;
level: 0 | 1 | 2;
};
```
- level is derived from my self-evaluation during review,
- scheduling is intentionally manual and lightweight (no spaced repetition algorithm).

## 🎯 Design Decisions

- Single source of truth
  - All cards live in a single client-side store.
- Derived UI instead of duplicated state
  - UI behavior (e.g. which card is active) is derived from existing state,
  not controlled by additional boolean flags.
- Local-first
  - localStorage is enough for a personal tool and avoids unnecessary backend complexity.

## 🚧 Non-goals (by design)

- No authentication
- No cloud sync
- No spaced repetition algorithm
- No heavy UI framework
- The goal is daily usability, not feature completeness.

## 🧪 Status

- Actively used for daily interview preparation
- Iterated only when a real need appears