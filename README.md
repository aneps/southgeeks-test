# User Management App

A full-stack application for managing users with automatic location data integration. Built with Node.js, Express, Firebase Realtime Database, and React.

## What's Inside

- User management with geolocation features
- React TypeScript frontend with modern UI
- RESTful API with Firebase integration
- OpenWeatherMap API for location data

## Getting Started

### You'll Need

- Node.js (v12+)
- npm or yarn
- Internet connection for location data

### Quick Start

```bash
# Install everything
npm install

# Set up your environment
cp .env.example .env

# Fire up the server
npm start
```

The server runs at http://localhost:8080 with these endpoints:
- GET / - Welcome message
- POST /users - Create a user
- GET /users - List all users
- GET /users/:id - Get a specific user
- PUT /users/:id - Update a user
- DELETE /users/:id - Remove a user
- GET /users/search?zip=90210 - Find users by zip code

Want to test it out? Try:
```bash
curl http://localhost:8080/
node test-api.js
```

## Frontend App

The React app gives you a beautiful interface to manage users. Here's how to run it:

```bash
# Jump to the frontend folder
cd frontend

# Install dependencies
npm install

# Start it up
npm start
```

Your browser will open to http://localhost:3000 with the app ready to use.

### Run Everything

For the full experience, run both backend and frontend:

```bash
# Terminal 1: Start the API
npm start

# Terminal 2: Start the React app
cd frontend && npm start
```

## Features

### What You Can Do

- **Add users** with just a name and zip code - we'll fetch location data automatically
- **View everyone** in a clean, organized table
- **Edit details** anytime - location updates when zip codes change
- **Search by zip code** to filter users
- **Delete users** with a confirmation to prevent accidents
- **Works everywhere** - responsive design for all devices

### Under the Hood

- **Firebase Realtime Database** for persistent storage
- **OpenWeatherMap API** integration for accurate location data
- **React with TypeScript** for a type-safe frontend
- **Clean component architecture** for maintainable code
- **Modern React Hooks** for elegant state management
- **Comprehensive validation** for data integrity

## How It Works

### User Management Made Simple

When you add a user with a zip code, the app automatically:

1. Validates your input
2. Fetches location data from OpenWeatherMap
3. Stores everything in Firebase
4. Updates the UI instantly

### API Design

The backend follows REST principles with these endpoints:

```
GET    /            → Welcome message
POST   /users       → Create user
GET    /users       → List all users
GET    /users/:id   → Get one user
PUT    /users/:id   → Update a user
DELETE /users/:id   → Remove a user
GET    /users/search → Find by zip code
```

All operations are async with proper error handling.

### Testing

Try these to see it working:

```bash
# Run the automated tests
node test-api.js

# Or use the Postman collection
# Import User-Management-API.postman_collection.json
```

## API Examples

### Create a User

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","zipCode":"90210"}'  
```

Response:
```json
{
  "id": "abc123",
  "name": "Jane Smith",
  "zipCode": "90210",
  "latitude": 34.0901,
  "longitude": -118.4065,
  "timezone": -28800,
  "createdAt": "2023-04-15T18:22:05.962Z"
}
```

### Find a User

```bash
curl http://localhost:8080/users/abc123
```

## What's Where

```
├── backend/
│   ├── src/
│   │   ├── config/           # App configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   └── index.js          # Entry point
│   ├── .env                  # Environment variables
│   └── package.json          # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API integration
│   │   └── App.tsx           # Main React app
│   └── package.json          # Frontend dependencies
```

## Troubleshooting

### Quick Fixes

- **Server won't start?** Check if port 8080 is already in use
- **API errors?** Verify your internet connection and valid zip codes
- **Frontend issues?** Make sure the backend is running first
