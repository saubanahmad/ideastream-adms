# IdeaStream

## Overview
IdeaStream is a multi-database social media web application. It allows users to register, log in, create posts, vote on posts, comment, and connect with friends in a rich, interactive environment.

## Academic Purpose
This project is developed as part of the Advanced Database Management Systems (ADMS) course. It demonstrates advanced concepts in data modeling, polyglot persistence, and modern web application architecture.

## Background
The original version of IdeaStream was a simple C++ and text-file based project. This iteration represents a professional rebuild from the ground up, utilizing modern web technologies and a multi-database architecture to handle complex, large-scale social media data more efficiently.

## Main Features
- User registration and authentication
- Profile management
- Post creation and feed viewing
- Upvoting and downvoting on posts
- Commenting on posts
- Friend connections and social graph visualization

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js + Express
- **Databases:** PostgreSQL, MongoDB, Neo4j
- **ORM:** Prisma (for PostgreSQL)
- **Authentication:** JWT
- **Security:** bcrypt (for password hashing)

## Why Polyglot Persistence?
To handle the diverse data requirements of a social network efficiently, this project uses specialized databases for different types of data:
- **PostgreSQL:** Used for structured user, authentication, and profile data, ensuring strong ACID compliance where consistency is paramount.
- **MongoDB:** Used for unstructured and semi-structured content like posts, comments, and feed data, allowing for flexible schemas and fast read/write operations for content streams.
- **Neo4j:** A graph database utilized specifically for managing social connections and friend relationships, which are inherently highly connected and complex to query in traditional relational models.

## System Architecture
The application follows a standard client-server architecture with a polyglot data layer:
- The React frontend communicates via REST APIs to the Node.js/Express backend.
- The backend handles authentication, business logic, and coordinates data access across PostgreSQL, MongoDB, and Neo4j based on the operation.

## Folder Structure
```
IdeaStream/
├── backend/       # Node.js + Express server and API routes
├── frontend/      # React client application
├── docs/          # Project documentation and planning files
├── README.md      # Project overview and setup instructions
├── .gitignore     # Git ignore rules
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- MongoDB installed and running
- Neo4j installed and running

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```
4. Run Prisma migrations (if applicable):
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` if necessary and configure any required frontend variables.
4. Start the React development server:
   ```bash
   npm start
   ```

## Environment Variables
See `backend/.env.example` for the required environment variables to run the backend server. These include database connection URIs, ports, and secret keys for JWT.

## Current Progress
- [x] Initial repository setup and documentation structure.
- [ ] Backend setup and database configurations.
- [ ] Frontend setup and basic routing.

## Future Improvements
- Implement real-time notifications using WebSockets.
- Add advanced feed recommendation algorithms.
- Deploy the application to a cloud provider (e.g., AWS, Heroku, or Vercel).
- Enhance the UI/UX with modern design frameworks.

## Team Members
- [Your Name/Team Member Name] - [Role]

## License / Note
This is an academic project developed for the Advanced Database Management Systems course.
