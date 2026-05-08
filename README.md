# 🛰️ ISS Live Tracker & AI News Dashboard

A modern, real-time dashboard for tracking the International Space Station, exploring space news, and chatting with an AI assistant — all in one beautiful interface.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🗺️ ISS Live Tracking
- Real-time ISS position updates every 15 seconds
- Interactive Leaflet map with custom animated marker
- Trajectory path visualization (polyline)
- Speed calculation using the Haversine formula
- Nearest location/ocean detection
- Manual refresh button

### 👨‍🚀 People in Space
- Live astronaut count
- Names grouped by spacecraft
- Auto-refresh every 60 seconds

### 📰 Space News Dashboard
- Latest space and NASA news articles
- Search functionality
- Sort by date or source
- Category-based filtering via interactive pie chart
- 15-minute localStorage cache
- Responsive card grid with hover effects
- Fallback mock data when no API key is configured

### 🤖 AI Chatbot
- Powered by Mistral-7B-Instruct via Hugging Face
- Strictly grounded to dashboard data only
- Floating bottom-right chat interface
- Typing indicator and auto-scroll
- Chat history persistence (last 30 messages)
- Suggested quick-action prompts
- Intelligent local fallback when API is unavailable

### 📊 Charts & Analytics
- Real-time ISS speed history (Area chart)
- News category distribution (Interactive doughnut chart)
- Click-to-filter chart interaction

### 🎨 UI/UX
- Glassmorphism design language
- Dark/Light theme with persistence
- Smooth Framer Motion animations
- Fully responsive (mobile, tablet, desktop)
- Skeleton loaders for loading states
- Toast notifications
- Custom scrollbar styling

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| Maps | Leaflet.js + React Leaflet |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Axios |
| Routing | React Router DOM |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| AI | Hugging Face Inference API (Mistral-7B) |

---

## 📡 APIs Used

| API | Purpose | URL |
|-----|---------|-----|
| Open Notify ISS | ISS position tracking | `http://api.open-notify.org/iss-now.json` |
| Open Notify Astros | People in space | `http://api.open-notify.org/astros.json` |
| NewsAPI | Space news articles | `https://newsapi.org/v2/everything` |
| Hugging Face | AI chatbot inference | `https://api-inference.huggingface.co` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd exam

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Edit the `.env` file with your API keys:

```env
# Get from https://newsapi.org
VITE_NEWS_API_KEY=your_news_api_key_here

# Get from https://huggingface.co/settings/tokens
VITE_AI_TOKEN=your_hugging_face_token_here
```

> **Note:** The app works without API keys — it uses mock news data and local AI responses as fallbacks.

### Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment (Vercel)

This project is fully configured for Vercel deployment.

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod
```

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Set environment variables in the Vercel dashboard
5. Deploy

### Environment Variables on Vercel

Add these in your Vercel project settings → Environment Variables:

- `VITE_NEWS_API_KEY`
- `VITE_AI_TOKEN`

---

## 📁 Project Structure

```
exam/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ISSMap.jsx
│   │   ├── ISSStats.jsx
│   │   ├── ISSPeople.jsx
│   │   ├── NewsCard.jsx
│   │   ├── NewsSection.jsx
│   │   ├── Chatbot.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── ErrorBox.jsx
│   │   ├── SpeedChart.jsx
│   │   └── NewsPieChart.jsx
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useISSData.js
│   │   └── useNewsData.js
│   ├── services/
│   │   ├── issService.js
│   │   ├── newsService.js
│   │   └── aiService.js
│   ├── utils/
│   │   ├── haversine.js
│   │   └── localStorage.js
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── README.md
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 📸 Screenshots

*Screenshots will be added after deployment.*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, Vite, and Tailwind CSS
