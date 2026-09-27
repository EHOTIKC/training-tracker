# Training Tracker

A full-stack web application for logging, filtering, and analyzing workout sessions. Built with React, Node.js/Express, and containerized using Docker Compose.

## Features

- **Session Management:** Full CRUD operations for training sessions.
- **Analytics & Visualizations:** Interactive charts powered by Recharts (duration by category, completion rates).
- **Search & Filtering:** Real-time search, tag filtering, category select, and duration/title sorting.
- **Resilient UI:** Skeleton loaders, dark/light theme support, and error state with retry mechanics.
- **Dockerized Environment:** Isolated frontend and backend services orchestrated with Docker Compose.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Recharts, Vite
- **Backend:** Node.js, Express, TypeScript
- **DevOps:** Docker, Docker Compose

## Getting Started

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/EHOTIKC/training-tracker.git
cd training-tracker
```

2. Start the services:
```bash
docker compose up --build
```

- Frontend runs at: `http://localhost:5173`
- Backend runs at: `http://localhost:3000`

---

### Running Locally without Docker

1. **Backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```