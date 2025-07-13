require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    newsApiKey: process.env.NEWS_API_KEY || 'your-news-api-key',
    newsApiUrl: 'https://newsapi.org/v2/top-headlines',
    bcryptRounds: 10
}; 