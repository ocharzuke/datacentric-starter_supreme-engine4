# Movie Management API Testing Guide

## Setup Instructions

1. **Install dependencies**:

   ```bash
   npm install express cors mongodb bcrypt jsonwebtoken dotenv
   ```

2. **Set up environment variables**:
   Create a `.env` file with:

   ```
   MONGO_URI=your_mongodb_connection_string
   TOKEN_SECRET=your_secret_key_for_jwt
   ```

3. **Import sample data**:

   ```bash
   node import-script.js
   ```

4. **Start the server**:
   ```bash
   node index.js
   ```

## API Endpoints for Testing

### Authentication

1. **Login** (Get JWT token):

   ```
   POST /login
   Body: { "email": "admin@moviedb.com", "password": "admin123!" }
   ```

2. **Register new user**:

   ```
   POST /users
   Body: { "email": "newuser@example.com", "password": "password123" }
   ```

3. **View profile** (Requires token):
   ```
   GET /profile
   Headers: Authorization: Bearer your_jwt_token
   ```

### Movie Operations

1. **Get all movies** (Requires token):

   ```
   GET /movies
   Headers: Authorization: Bearer your_jwt_token
   ```

2. **Search movies** (Requires token):

   ```
   GET /movies?title=Space
   GET /movies?genre=Science+Fiction
   GET /movies?categories=Blockbuster,Franchise
   GET /movies?cast=John+Richards
   Headers: Authorization: Bearer your_jwt_token
   ```

3. **Get movie by ID**:

   ```
   GET /movies/60d21b4667d0d8992e610cb0
   ```

4. **Create new movie**:

   ```
   POST /movies
   Body: {
     "title": "New Test Movie",
     "genre": "Action",
     "duration": 120,
     "releaseYear": 2025,
     "rating": 4.0,
     "cast": [
       {
         "name": "Test Actor",
         "role": "Main Character",
         "profile": "Test profile"
       }
     ],
     "reviews": [
       {
         "author": "Test Reviewer",
         "content": "This is a test review",
         "rating": 4,
         "date": "2025-03-01T00:00:00Z"
       }
     ],
     "categories": ["Family-Friendly", "Indie"]
   }
   ```

5. **Update movie**:

   ```
   PUT /movies/60d21b4667d0d8992e610cb0
   Body: { same format as above with updated values }
   ```

6. **Delete movie**:
   ```
   DELETE /movies/60d21b4667d0d8992e610cb0
   ```

## Testing with Postman or cURL

### User Login Credentials

| Email                | Password    | Role     |
| -------------------- | ----------- | -------- |
| admin@moviedb.com    | admin123!   | admin    |
| user1@example.com    | userpass1   | user     |
| user2@example.com    | userpass2   | user     |
| editor@moviedb.com   | editor123   | editor   |
| reviewer@moviedb.com | reviewer123 | reviewer |

These plaintext passwords correspond to the bcrypt hashes in the users.json file.

Example cURL commands for testing:

1. **Login to get token**:

   ```bash
   curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@moviedb.com","password":"admin123!"}'
   ```

2. **Get all movies (with token)**:

   ```bash
   curl -X GET http://localhost:3000/movies \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Create new movie**:
   ```bash
   curl -X POST http://localhost:3000/movies \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "title": "Test Movie",
       "genre": "Action",
       "duration": 120,
       "releaseYear": 2025,
       "rating": 4.5,
       "cast": [{"name": "Test Actor", "role": "Lead", "profile": "Test profile"}],
       "reviews": [{"author": "Reviewer", "content": "Good", "rating": 4, "date": "2025-03-01"}],
       "categories": ["Blockbuster", "Family-Friendly"]
     }'
   ```
