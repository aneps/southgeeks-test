const https = require('https');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE = process.env.WEATHER_API_BASE;

function fetchLocationData(zipCode) {
    return new Promise((resolve, reject) => {
        const path = `/data/2.5/weather?zip=${zipCode}&appid=${WEATHER_API_KEY}`;

        const options = {
            hostname: WEATHER_API_BASE,
            port: 443,
            path: path,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const weatherData = JSON.parse(data);
                    if (weatherData.cod === 200) {
                        resolve({
                            latitude: weatherData.coord.lat,
                            longitude: weatherData.coord.lon,
                            timezone: weatherData.timezone
                        });
                    } else {
                        reject(new Error(`Weather API error: ${weatherData.message}`));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse weather API response'));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

module.exports = {
    fetchLocationData
};
