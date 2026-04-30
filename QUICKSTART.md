# Quick Start Guide

## 🚀 Getting Started with MovieHub

### Step 1: Prepare Your System
- Ensure Node.js 16+ is installed: `node --version`
- Navigate to the project folder

### Step 2: Get Required API Keys

#### TMDB API Key
1. Visit [TMDB API](https://www.themoviedb.org/settings/api)
2. Create account and request API key
3. Copy your API key (should look like: `f025f0942e0b39070c54e5b418c4d3ad`)

#### Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Go to Project Settings → General
4. Copy your Firebase config values

### Step 3: Setup Environment File

1. Open `.env` in the root directory
2. Replace with your actual keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Install Dependencies

```bash
npm install
```

This will install:
- React & React Router
- Firebase
- Tailwind CSS
- Framer Motion
- Lucide Icons
- And other dependencies

### Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

### Step 6: Create Test Account

1. Click "Sign Up" button
2. Enter email and password
3. Click "Sign Up"
4. You're logged in! 🎉

## 📝 Account Features

- **Explore**: Browse trending movies on home page
- **Search**: Use the search bar to find movies
- **Favorites**: Click ❤️ to save movies (requires login)
- **Watchlist**: Save movies to watch later
- **Profile**: View your stats and saved movies
- **Dark Mode**: Toggle theme with 🌙/☀️ icon
- **Logout**: Sign out from profile page

## 🛠 Build for Production

```bash
npm run build
npm run preview
```

## 📂 File Structure

```
src/
├── pages/           # All page components
├── components/      # Reusable components
├── context/         # React Context (Auth, Theme, Movies)
├── hooks/           # Custom React hooks
├── config/          # Firebase configuration
└── App.jsx          # Main app file
```

## 🔍 Troubleshooting

**Movies not loading?**
- Check your TMDB API key in `.env`
- Verify the API key is valid on TMDB website

**Can't sign up?**
- Check Firebase credentials in `.env`
- Verify Firebase project has Email/Password auth enabled

**Port 5173 already in use?**
- Run: `npm run dev -- --port 3000`

## ✨ Features Overview

| Feature | Status |
|---------|--------|
| User Authentication | ✅ |
| Movie Search | ✅ |
| Favorites | ✅ |
| Watchlist | ✅ |
| Dark Mode | ✅ |
| Movie Details | ✅ |
| Cast & Crew | ✅ |
| Trailers | ✅ |
| Recommendations | ✅ |
| Mobile Responsive | ✅ |

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [TMDB API](https://www.themoviedb.org/settings/api)
- [Framer Motion](https://www.framer.com/motion/)

## 📞 Need Help?

Check the main README.md for detailed documentation or debug using:
- Browser DevTools Console (F12)
- Network tab for API calls
- Firebase Console for auth issues