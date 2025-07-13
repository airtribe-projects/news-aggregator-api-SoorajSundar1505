# News Aggregator API

A RESTful API for a personalized news aggregator built with Node.js, Express.js, bcrypt, and JWT. This API provides user authentication, preference management, and personalized news fetching from external news APIs.

## Features

- 🔐 **User Authentication**: Secure signup and login with JWT tokens
- 👤 **User Preferences**: Manage personalized news preferences
- 📰 **News Aggregation**: Fetch news based on user preferences
- 🛡️ **Security**: Password hashing with bcrypt and token-based authentication
- ✅ **Validation**: Input validation and error handling
- 🌐 **CORS Support**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-aggregator-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEWS_API_KEY=your-news-api-key-here
```

4. Get a News API key:
   - Visit [NewsAPI.org](https://newsapi.org/)
   - Sign up for a free account
   - Copy your API key to the `.env` file

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

### Authentication

#### POST /users/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "preferences": ["technology", "science"]
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": ["technology", "science"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /users/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": ["technology", "science"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Preferences

#### GET /users/preferences
Get user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "preferences": ["technology", "science"]
}
```

#### PUT /users/preferences
Update user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "preferences": ["technology", "science", "business"]
}
```

**Response:**
```json
{
  "message": "Preferences updated successfully",
  "preferences": ["technology", "science", "business"]
}
```

### News

#### GET /news
Get personalized news based on user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "news": [
    {
      "title": "Latest Technology News",
      "description": "Breaking news in the technology world...",
      "url": "https://example.com/article",
      "publishedAt": "2024-01-01T12:00:00Z",
      "source": {
        "name": "Tech News"
      }
    }
  ]
}
```

### Health Check

#### GET /health
Check API status.

**Response:**
```json
{
  "status": "OK",
  "message": "News Aggregator API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without exposing sensitive information

## External News APIs

The application integrates with external news APIs to provide real-time news content. Currently supported:

- **NewsAPI.org**: Primary news source (100 requests/day free tier)
- **Fallback**: Mock data when API key is not configured

To use other news APIs, you can modify the `config/config.js` file and update the news fetching logic in `routes/news.js`.

## Project Structure

```
news-aggregator-api/
├── config/
│   └── config.js          # Configuration settings
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── validation.js      # Input validation middleware
├── models/
│   └── User.js            # User model and data management
├── routes/
│   ├── users.js           # User authentication and preferences routes
│   └── news.js            # News fetching routes
├── test/
│   └── server.test.js     # API tests
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Testing

Run the test suite to verify all endpoints work correctly:

```bash
npm test
```

The tests cover:
- User signup and login
- Authentication token validation
- User preferences management
- News fetching with authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the ISC License.
