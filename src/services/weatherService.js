const https = require('https');
require('dotenv').config({ path: '../backend/.env' });

// OpenWeatherMap API configuration from environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE = process.env.WEATHER_API_BASE;
