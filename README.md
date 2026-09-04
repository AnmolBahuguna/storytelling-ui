# AI Story Frontend

An interactive React application for creating personalized, educational stories with AI. Users can choose a hero, age group, subject, theme, language, media preferences, and story length, then read and interact with the generated story.

## Features

- Animated landing page with light/dark theme support
- Email/password authentication
- Google OAuth sign-in
- Three-step story creation flow:
  - Hero name and age group
  - Learning focus and story theme
  - Language, duration, location, and optional extra details
- Five learning focuses: Maths, Science, History, Creative, and Just for Fun
- Twelve story themes: Space, Jungle, Fairytale, Ocean, Superhero, Magic, Mystery, Animals, Robots, Sports, History, and Winter
- 22 story and narration languages, including English, Hindi, Spanish, French, German, Italian, Japanese, Chinese, Korean, Portuguese, Russian, Arabic, Bengali, Marathi, Telugu, Tamil, Gujarati, Punjabi, Kannada, Malayalam, Odia, and Turkish
- AI-generated stories with illustrated slides
- Story viewer with:
  - Previous/next slide navigation
  - Auto-play narration
  - Audio generation and caching
  - Glossary support
  - Interactive challenges and quizzes
  - Confetti feedback for completed activities
  - PDF export with slide images and text
- Story history and playlist support through the dashboard sidebar
- Responsive UI with Tailwind CSS, Framer Motion animations, and Lucide icons

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4 with `@tailwindcss/vite`
- Framer Motion
- Three.js / React Three Fiber
- Google OAuth
- jsPDF and html-to-image for PDF export
- ESLint 9

## Requirements

- Node.js 20.19+ (or Node.js 22.12+)
- npm
- A running AI Story backend API

The frontend uses the Vite development proxy to forward `/api` requests to `http://127.0.0.1:5000` by default. The backend must provide the authentication, story, audio, payment, history, and playlist endpoints used by the UI.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SERVER_URL=http://127.0.0.1:5000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

`VITE_SERVER_URL` may be left empty when the frontend and backend are served from the same origin or when using the Vite `/api` proxy.

For Google sign-in, create a Web OAuth client in Google Cloud Console and add the development and production origins to its authorized JavaScript origins.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page with product information, pricing, and authentication dialogs |
| `/dashboard` | Authenticated story creation dashboard |
| `/story-view` | Story reader/player for generated stories and playlists |

The dashboard checks for an `access_token` cookie and redirects unauthenticated users to `/`.

## Backend API Integration

The frontend currently calls these backend routes:

| Endpoint | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create an account |
| `POST /api/auth/login` | Email/password login; returns an access token |
| `POST /api/auth/google` | Google credential authentication; returns an access token |
| `GET /api/payments/status` | Load the signed-in user's subscription tier |
| `POST /api/payments/create-checkout-session` | Create a hosted checkout session for a paid plan |
| `POST /api/generate-story` | Generate a story from the creation form |
| `POST /api/generate-speech` | Generate narration audio for a story slide |
| `GET /api/my-stories` | Load the signed-in user's story history |
| `DELETE /api/my-stories/:storyId` | Delete a saved story |
| `GET /api/playlists` | Load the user's playlists |
| `POST /api/playlists` | Create a playlist |
| `POST /api/playlists/:playlistId/add/:storyId` | Add a story to a playlist |

Authenticated requests send the access token in the `Authorization` header. The login flow stores the returned token in the `access_token` cookie for one day. The payment flow redirects the browser to the checkout URL returned by the backend.

The generated story is expected to contain a `slides` array. Each slide should provide story text and an image path or URL. Relative image paths are resolved against `VITE_SERVER_URL`.

## Project Structure

```text
src/
├── App.jsx                    # Application routes
├── main.jsx                   # React entry point and OAuth provider
├── index.css                  # Global styles and Tailwind imports
├── pages/
│   ├── LandingPage.jsx        # Public marketing page
│   ├── CreateStory.jsx        # Authenticated story builder
│   └── StoryViewer.jsx        # Story reader, audio, quiz, and PDF export
├── components/
│   ├── landing/               # Hero, pricing, and value proposition sections
│   ├── story/                 # Story builder steps
│   ├── ui/                    # Header, footer, dialogs, sidebar, loading UI
│   └── animate-ui/            # Animated backgrounds
├── constants/                 # Theme configuration
├── lib/                       # Shared helpers
└── utils/                     # Localized story/fun-fact data
```

Static theme artwork and other public assets are stored in [`public/`](./public). Theme thumbnails are in [`public/themes/`](./public/themes).

## Production Build

Build the application with:

```bash
npm run build
```

Deploy the generated `dist/` directory to any static hosting provider. The repository includes [`staticwebapp.config.json`](./staticwebapp.config.json) for Azure Static Web Apps navigation fallback. For other providers, configure the equivalent SPA fallback so client-side routes (`/dashboard` and `/story-view`) serve `index.html`. Set the production values for `VITE_SERVER_URL` and `VITE_GOOGLE_CLIENT_ID` before building.

## Development Notes

- Do not commit `.env`; use `.env.sample` as the environment variable reference.
- The backend must be running for authentication, story generation, subscription status, payments, library data, playlists, and narration.
- The story viewer includes a local mock slide fallback for UI preview when no story is passed through router state.
- Theme preference is persisted in `localStorage` under the `theme` key.
