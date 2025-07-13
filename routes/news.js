const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const config = require('../config/config');

const router = express.Router();

// GET /news
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        // If no preferences, return general news
        if (!user.preferences || user.preferences.length === 0) {
            const response = await axios.get(config.newsApiUrl, {
                params: {
                    apiKey: config.newsApiKey,
                    country: 'us',
                    pageSize: 10
                }
            });

            return res.status(200).json({
                news: response.data.articles || []
            });
        }

        // Fetch news for each preference
        const newsPromises = user.preferences.map(async (preference) => {
            try {
                const response = await axios.get(config.newsApiUrl, {
                    params: {
                        apiKey: config.newsApiKey,
                        q: preference,
                        pageSize: 5,
                        sortBy: 'publishedAt'
                    }
                });
                return {
                    category: preference,
                    articles: response.data.articles || []
                };
            } catch (error) {
                console.error(`Error fetching news for ${preference}:`, error.message);
                return {
                    category: preference,
                    articles: []
                };
            }
        });

        const newsResults = await Promise.all(newsPromises);
        
        // Flatten all articles into a single array
        const allArticles = newsResults.reduce((acc, result) => {
            return acc.concat(result.articles);
        }, []);

        // Remove duplicates based on title
        const uniqueArticles = allArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.title === article.title)
        );

        // Sort by published date (newest first)
        const sortedArticles = uniqueArticles.sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        res.status(200).json({
            news: sortedArticles.slice(0, 20) // Limit to 20 articles
        });

    } catch (error) {
        console.error('Error fetching news:', error.message);
        
        // If API key is not configured, return mock data
        if (config.newsApiKey === 'your-news-api-key') {
            return res.status(200).json({
                news: [
                    {
                        title: 'Sample News Article',
                        description: 'This is a sample news article. Please configure your News API key to get real news.',
                        url: 'https://example.com',
                        publishedAt: new Date().toISOString(),
                        source: { name: 'Sample News' }
                    }
                ]
            });
        }

        res.status(500).json({
            error: 'Failed to fetch news',
            message: 'Unable to retrieve news articles at this time'
        });
    }
});

module.exports = router; 