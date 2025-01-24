

# Local Explorer

Local Explorer is an AI-driven web application that provides personalized activity recommendations based on your current location, weather conditions, and time. It's your personal concierge for discovering the perfect activities in your area.

# how to run the app
### 1st - run the command : docker compose up --build
### 2nd - go to http://localhost:8080/


## Features

### 1. Smart Activity Recommendations
- AI-powered suggestions using Google's Gemini Pro model
- Weather-aware recommendations
- Time-sensitive activity suggestions
- Non-repetitive suggestions system
- Personalized based on user preferences

### 2. Location & Weather Integration
- Real-time geolocation tracking
- Current weather conditions display
- Dynamic weather-based activity filtering
- Address reverse geocoding

### 3. Interactive Map Experience
- Google Maps integration
- Interactive markers for current location and destinations
- Info windows with detailed location information
- Smooth map transitions and animations

### 4. User Management
- User authentication system
- Personal favorites collection
- Activity preference tracking
- History-based recommendation improvements

## Technology Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- @vis.gl/react-google-maps for map integration
- Axios for API communication

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Google's Generative AI (Gemini Pro)
- JWT for authentication
- Various APIs integration (OpenWeatherMap, LocationIQ)


