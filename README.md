# MovieHub - Professional Movie Portal

A full-stack Movie Portal web application built with React.js, Tailwind CSS, Firebase Authentication, and TMDB API. Designed to impress in hackathons with a Netflix-inspired UI and professional features.

## ✨ Features

### Core Features
- **User Authentication**: Sign up, login, and logout with Firebase
- **Home Page**: Trending movies with beautiful card layout and animations
- **Search**: Real-time movie search with API integration
- **Movie Details**: Full details including cast, crew, trailer, and similar movies
- **Favorites**: Save and manage favorite movies
- **Watchlist**: Track movies you want to watch
- **Profile**: User dashboard with stats and saved movies
- **Dark/Light Mode**: Netflix-inspired theme toggle with persistence

### Advanced Features
- **Protected Routes**: Only authenticated users can access favorites and profile
- **Loading Skeletons**: Shimmer UI while fetching data
- **Error Handling**: Proper error messages for API failures
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion animations for interactions
- **Lazy Loading**: Performance-optimized image loading
- **Infinite Grid**: Responsive movie grid layout

## 🛠 Tech Stack

- **Frontend**: React.js 18+
- **Backend**: Node.js + Express (port 4000) + Python FastAPI (port 8000)
- **AI**: Groq API via Python microservice
- **Styling**: Tailwind CSS 3+ with Dark Mode
- **State Management**: React Context API + Hooks
- **Authentication**: Firebase
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **API**: TMDB (The Movie Database)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+ and pip
- TMDB API Key
- Groq API Key
- Firebase Project

## 🚀 Setup Instructions

### 1. Get Your API Keys

**TMDB API Key:**
- Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- Create account and request API key
- Copy your API key

**Groq API Key:**
- Go to [https://console.groq.com/](https://console.groq.com/)
- Create account and get API key
- Copy your API key

**Firebase Project:**
- Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Create a new project
- Enable Email/Password authentication
- Get your Firebase config credentials

### 2. Clone or Download the Project

```bash
cd movie-portal
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create/update `.env` file in root directory:

```env
# TMDB API
VITE_TMDB_API_KEY=your_tmdb_api_key_here
TMDB_API_KEY=your_tmdb_api_key_here

# Groq API (for Python backend)
GROQ_API_KEY=your_groq_api_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Python Backend URL (optional, defaults to localhost:8000)
PYTHON_BACKEND_URL=http://localhost:8000
```

### 5. Install Python Dependencies

```bash
cd python-backend
pip install -r requirements.txt
cd ..
```

### 6. Run Development Servers

**Start Python Backend (Terminal 1):**
```bash
run-python-backend.bat
```
Or manually:
```bash
cd python-backend
python main.py
```

**Start Node.js Backend (Terminal 2):**
```bash
npm run server
```

**Start Frontend (Terminal 3):**
```bash
npm run dev
```

Open browser to: **http://localhost:5173**

### 7. Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
movie-portal/
├── python-backend/              # Python FastAPI AI service
│   ├── main.py                  # FastAPI app with AI endpoints
│   ├── requirements.txt         # Python dependencies
│   └── README.md                # Python backend documentation
├── server/                      # Node.js Express backend
│   └── groq.js                  # API routes (now calls Python backend)
├── src/                         # React frontend
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation with auth & search
│   │   ├── MovieCard.jsx        # Reusable movie card component
│   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   ├── pages/
│   │   ├── Home.jsx             # Trending movies & recommendations
│   │   ├── MovieDetails.jsx     # Full movie information
│   │   ├── Favorites.jsx        # Saved favorite movies
│   │   ├── Profile.jsx          # User profile & stats
│   │   ├── Login.jsx            # Login page
│   │   ├── SignUp.jsx           # Registration page
│   │   └── Search.jsx           # Search results page
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication context
│   │   ├── MovieContext.jsx     # Movie state management
│   │   └── ThemeContext.jsx     # Dark/Light mode
│   ├── hooks/
│   │   └── useMovieDetails.js   # Custom hook for movie details
│   ├── config/
│   │   └── firebase.js          # Firebase configuration
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── .env                         # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
├── run-server.bat               # Node.js server runner
├── run-python-backend.bat       # Python backend runner
└── README.md
```

## 🎯 Key Pages & Functionality

### Home Page
- Displays trending movies from TMDB
- Shows personalized recommendations based on favorites
- Loading skeletons while fetching data
- Smooth hover animations on movie cards

### Movie Details
- Full movie information (poster, overview, rating, genres, runtime)
- YouTube trailer embed
- Cast and crew information
- Similar movies recommendations
- Add to Favorites/Watchlist/Watched

### Search
- Real-time search using TMDB API
- Dynamic results as you type
- Grid layout with movie cards
- Direct navigation to movie details

### Authentication
- Email/Password registration
- Secure Firebase authentication
- Session persistence across page reloads
- Protected routes for favorites and profile

### Profile
- Display user information
- Stats cards (favorites, watchlist, watched count)
- Saved favorite movies
- Logout option

## 🎨 Design Highlights

- **Netflix-Inspired**: Dark theme with vibrant accent colors
- **Smooth Animations**: Framer Motion transitions throughout
- **Mobile Responsive**: Works seamlessly on all devices
- **Accessibility**: Semantic HTML and proper contrast ratios
- **Performance**: Optimized images and code splitting

## 🔐 Security

- API keys stored in `.env` file (not committed to git)
- Firebase authentication for secure user sessions
- Protected routes require authentication
- No sensitive data hardcoded

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚨 Troubleshooting

### "API Key not found"
- Ensure `.env` file exists with correct VITE_TMDB_API_KEY

### "Firebase not initialized"
- Check all Firebase environment variables in `.env`
- Verify Firebase project is set up correctly

### Movies not loading
- Check browser console for API errors
- Verify TMDB API key is valid
- Check network tab for failed requests

### Dark mode not working
- Clear browser localStorage
- Check if CSS class is applied to html element

## 📊 Performance Features

- ✅ Lazy loading images
- ✅ Code splitting with Vite
- ✅ CSS minification
- ✅ Image optimization
- ✅ Efficient re-renders with React hooks
- ✅ Virtual scrolling for large lists

## 🎓 Great for Hackathons

This project demonstrates:
- Full-stack development skills
- Professional UI/UX design
- Real API integration
- Authentication implementation
- State management
- Responsive design
- Performance optimization
- Clean, well-organized code

## 📄 License

MIT License - feel free to use for learning and hackathons

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Movie database and API
- [Firebase](https://firebase.google.com/) - Authentication and backend
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React](https://reactjs.org/) - UI library

## 📞 Support

For issues or questions, check:
1. TMDB API documentation
2. Firebase documentation
3. React Router documentation
4. Tailwind CSS documentation