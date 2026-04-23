# HireTrack AI 🚀

**HireTrack AI** is a premium, local-first Job Application Tracker and Professional Portfolio manager built as a single-page React application. It is designed to provide a seamless, private, and offline-capable experience for managing your career journey.

## ✨ Features

### 📋 My Jobs (Kanban Board)
- **Visual Pipeline**: Manage job applications across 6 stages: Researching, Applied, Follow-Up, Interview, Offer, and Rejected.
- **Drag-and-Drop**: Fluid card movement using `@dnd-kit`.
- **Live Stats**: Real-time analytics strip showing Total Applied, Interviews, Offers, and Rejection Rate.
- **Search & Filter**: Quickly find jobs by title or company.
- **CSV Export**: Export your entire job list for external use.

### 👤 About Me
- **Professional Profile**: Comprehensive bio and personal details.
- **Social Integration**: Links for LinkedIn, GitHub, and Portfolios.
- **Interest Tags**: Dynamic tag management for professional interests and skills.

### 💼 Experience Timeline
- **Career Journey**: A vertical timeline of professional roles.
- **Project Details**: Detailed descriptions and key achievements for every project.
- **16 Years History**: Pre-populated with Prachi Joshi's extensive 16-year career history.

### 📄 Document Management
- **Resumes**: Version management with colour-coded labels.
- **Documents**: Store company-specific cover letters and portfolios, grouped by company.

### 🎨 Design & UX
- **Editorial Aesthetic**: Modern design using DM Sans and Fraunces typography.
- **Themes**: Support for sleek Dark and Light modes (persisted in localStorage).
- **Animations**: Smooth transitions and modal effects powered by Framer Motion.
- **Local-First**: 100% offline data storage using IndexedDB (`idb`).

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Database**: IndexedDB (via `idb` library)
- **Utilities**: `date-fns`, `clsx`, `tailwind-merge`

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 📦 Project Structure

- `src/context/AppContext.jsx`: Central state management and IndexedDB sync.
- `src/lib/db.js`: IndexedDB wrapper for local-first storage.
- `src/components/kanban/`: Kanban board components.
- `src/components/tabs/`: Individual page/tab components (About, Experience, etc.).
- `src/components/ui/`: Reusable UI components like Modals and Layouts.

---
*Created by Antigravity for Prachi Joshi — April 2026*
