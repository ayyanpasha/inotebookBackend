# Project README

This project contains code for a simple authentication and note-taking application built with Node.js, Express, and MongoDB.

## Files Description

### `index.js`

Main entry point of the application. It initializes the Express app, connects to MongoDB, defines routes for authentication and note-related operations, and starts the server.

### `auth.js`

Defines routes and middleware for user authentication. It includes signup, login, and fetching user information endpoints.

### `note.js`

Defines routes and middleware for managing user notes. It includes CRUD operations for notes, such as creating, retrieving, updating, and deleting notes.

### `fetchUser.js`

Middleware function to extract user information from JWT token for authentication purposes.

### `Note.js`

Defines the Mongoose schema for the Note model, representing user notes stored in the MongoDB database.

### `User.js`

Defines the Mongoose schema for the User model, representing user accounts stored in the MongoDB database.

## Setup Instructions

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up a MongoDB database and update the connection URI in `db.js`.
4. Create a `.env` file based on the `.env.example` file and set the required environment variables.
5. Run the application using `npm start`.

## Available Routes

- **Authentication Routes**:

  - `POST /api/auth/signup`: Create a new user account.
  - `POST /api/auth/login`: Authenticate user and generate authentication token.
  - `POST /api/auth/getuser`: Fetch user details (requires authentication token).

- **Note Routes**:
  - `GET /api/note`: Get all notes of the authenticated user.
  - `POST /api/note`: Create a new note for the authenticated user.
  - `PUT /api/note/:id`: Update an existing note of the authenticated user.
  - `DELETE /api/note/:id`: Delete a note of the authenticated user.

## Dependencies

- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- express-validator

## Environment Variables

- `PORT`: Port number for the server to listen on.
- `MONGO_URI`: MongoDB connection URI.
- `JWT_SECRET`: Secret key for JWT token generation.
