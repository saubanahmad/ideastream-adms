# IdeaStream

**IdeaStream** is a multi-database social media web application. It allows users to register, log in, create posts, vote on posts, comment, and connect with friends in a rich, interactive environment.

This project is developed as part of the **Advanced Database Management Systems (ADMS)** course. It demonstrates advanced concepts in data modeling, polyglot persistence, and modern web application architecture by using a specialized database for each domain constraint.

---

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express
- **Databases:** PostgreSQL (Relational), MongoDB (Document), Neo4j (Graph)
- **ORM:** Prisma (for PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt (for password hashing)

---

## 1. Required Software Installation

To run this project on a fresh laptop, please install the following software:

1. **Node.js**: [Download (v18+ LTS recommended)](https://nodejs.org/)
   - Includes `npm` automatically.
2. **PostgreSQL**: [Download](https://www.postgresql.org/download/)
   - Default port is `5432`.
   - Install **pgAdmin** (often included in the installer) to view your tables easily.
3. **MongoDB**:
   - Option A (Local): Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and [MongoDB Compass](https://www.mongodb.com/products/compass) for viewing data.
   - Option B (Cloud): Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
4. **Neo4j**:
   - Option A (Local): Install [Neo4j Desktop](https://neo4j.com/download/).
   - Option B (Cloud): Create a free instance on [Neo4j AuraDB](https://neo4j.com/cloud/platform/aura-graph-database/).
5. **Git**: [Download](https://git-scm.com/)
6. **Code Editor**: [VS Code](https://code.visualstudio.com/)
   - *Helpful Extensions*: Prisma, ES7+ React/Redux/React-Native snippets, Prettier.

---

## 2. Environment Variables

Both the backend and frontend rely on `.env` files. **Never commit these files to version control.**

### Backend `.env`
Navigate to the `backend` folder. Copy the `.env.example` file to create a `.env` file:
```bash
cd backend
cp .env.example .env
```
Inside `backend/.env`, you will find placeholder values. Update them with your local/cloud credentials:

```env
# Server Configuration
PORT=5000

# PostgreSQL Connection String (for Prisma)
DATABASE_URL=postgresql://<YOUR_PG_USER>:<YOUR_PG_PASSWORD>@localhost:5432/ideastream_db?schema=public

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/ideastream_posts

# Neo4j Connection Details
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<YOUR_NEO4J_PASSWORD>

# Authentication
JWT_SECRET=super_secret_jwt_key_here
```

### Frontend `.env`
Navigate to the `frontend` folder and create its `.env`:
```bash
cd frontend
cp .env.example .env
```
Usually, the default value in `frontend/.env` is sufficient:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Database Setup

### PostgreSQL Setup (Users & Auth)
1. Open **pgAdmin** (or use the `psql` command line tool).
2. Create a new database named `ideastream_db`.
3. Make sure your `DATABASE_URL` in `backend/.env` matches your postgres credentials and database name.
4. Run Prisma commands in the `backend` folder to create tables and generate the Prisma Client:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev --name init
   ```

### MongoDB Setup (Posts & Comments)
1. If running locally, simply start your MongoDB service (default port `27017`).
2. The database (`ideastream_posts`) will be created automatically when the backend inserts the first post. No manual initialization is required.

### Neo4j Setup (Friends & Social Graph)
1. Open Neo4j Desktop (or your AuraDB console).
2. Create a new local DBMS and start it.
3. Make sure to update the `NEO4J_PASSWORD` in your `backend/.env` file.
4. No migrations are needed; nodes and relationships will be created dynamically.

---

## 4. Running the Project

### Clone the Repository
```bash
git clone <YOUR_REPO_URL>
cd IDEASTREAM
```

### Start the Backend
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### Start the Frontend
1. Open a second terminal window/tab and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

### Verification & Testing
1. **Signup/Login**: Register a new user in the browser. You should see a successful token response.
2. **Database Check**: Open pgAdmin and check the `users` table to verify your user was saved.
3. *(More testing will be added as posts/friends features are fully connected in the frontend).*

---

## 🐛 Common Errors and Fixes

- **"PrismaClientInitializationError: Can't reach database server at localhost:5432"**
  - Fix: Ensure PostgreSQL is running and `DATABASE_URL` in `.env` is correct.
- **"MongoTimeoutError: Server selection timed out after 30000 ms"**
  - Fix: Ensure MongoDB is running locally or your Atlas IP is whitelisted.
- **Neo4j Authentication Error**
  - Fix: Ensure `NEO4J_PASSWORD` is correct and the Neo4j database is explicitly started in Neo4j Desktop.
- **"npm ERR! code ERESOLVE"**
  - Fix: Try installing with `npm install --legacy-peer-deps` (though standard `npm install` should work).

---

## 🎓 Notes for University Evaluation

- The `old_project_backup/` directory contains the legacy C++ file-based version. It is kept solely for reference and comparison.
- We utilize **Polyglot Persistence**:
  - PostgreSQL handles structured data requiring strong ACID compliance (Users).
  - MongoDB handles high-volume, unstructured/schema-less data (Posts/Feed).
  - Neo4j efficiently queries complex, highly-connected data (Friend Graphs).
- The central Git ignore configuration (`.gitignore` at root level) ensures no sensitive credentials, local databases, or build artifacts are pushed.

Enjoy exploring IdeaStream!
