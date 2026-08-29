# 🅰️ Animeta — Discover Your Next Anime

A modern anime discovery app built with **React 19**, **Tailwind CSS 4**, and **Appwrite**. Search for anime, explore trending titles, and view detailed information — all powered by the [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs).

![Animeta Screenshot](public/hero-img.png)

## ✨ Features

- **🔍 Smart Search** — Debounced search with real-time results from AniList
- **📈 Trending Section** — Tracks popular searches using Appwrite and displays the most-searched anime
- **🎬 Anime Details** — Detailed view with trailer, genres, studios, ratings, and metadata
- **📱 Responsive Design** — Glassmorphism UI that works on desktop and mobile
- **⚡ Fast** — Built with Vite 8 for instant HMR and optimized builds

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Vite 8](https://vite.dev/) | Build tool & dev server |
| [Appwrite](https://appwrite.io/) | Backend — database for trending search metrics |
| [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs) | Anime data source (GraphQL) |

## 📁 Project Structure

```
src/
├── components/
│   ├── Bars.jsx          # Loading spinner animation
│   ├── MovieCard.jsx     # Anime card for the popular grid
│   ├── Search.jsx        # Search input component
│   └── TrendingCard.jsx  # Trending anime card with rank number
├── config/
│   ├── api.js            # AniList GraphQL queries & fetch helpers
│   └── appwrite.js       # Appwrite client, search count & trending functions
├── hooks/
│   └── useDebounce.js    # Custom debounce hook
├── lib/
│   └── utils.js          # Utility functions (cn helper)
├── pages/
│   ├── Home.jsx          # Main page — search, trending, popular grid
│   └── AnimeDetails.jsx  # Detailed anime view with trailer
├── App.jsx               # Route definitions
├── main.jsx              # App entry point
├── App.css               # Custom styles
└── index.css             # Global styles & Tailwind imports
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- An [Appwrite](https://appwrite.io/) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/RavishkaB2003/Animeta.git
cd animeta
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Appwrite

1. Create a new project on [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a **Database**
3. Create a **Collection** (e.g., `metrics`) with the following attributes:

| Attribute | Type | Required |
|---|---|---|
| `searchTerm` | String (255) | Yes |
| `count` | Integer | Yes |
| `movie_id` | Integer | Yes |
| `poster_url` | String (2048) | Yes |

4. Under **Settings** → **Permissions**, add a role for **Any** with **Create**, **Read**, **Update** permissions

### 4. Configure environment variables

Copy the example env file and fill in your Appwrite credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_ANILIST_API_URL=https://graphql.anilist.co
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TABLE_ID=your_collection_id
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo on [Vercel](https://vercel.com/)
3. Add your environment variables in **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Vite and configures the build

### Manual Build

```bash
npm run build
```

The `dist/` folder contains the production-ready static files. Serve them with any static hosting provider.

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_ANILIST_API_URL` | AniList GraphQL endpoint (default: `https://graphql.anilist.co`) |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID |
| `VITE_APPWRITE_DATABASE_ID` | Your Appwrite database ID |
| `VITE_APPWRITE_TABLE_ID` | Your Appwrite collection/table ID |
| `VITE_APPWRITE_ENDPOINT` | Your Appwrite API endpoint |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
