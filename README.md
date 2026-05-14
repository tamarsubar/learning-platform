# AI-Driven Learning Platform

A full-stack mini learning platform that allows users to select topics, receive AI-generated lessons, and review their learning history.

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Sequelize ORM |
| AI | OpenAI GPT API (gpt-3.5-turbo) |
| DevOps | Docker, Docker Compose |

---

## Project Structure

```
learning-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── services/       # AI service
│   ├── index.js            # Entry point + DB seed
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   └── components/     # Shared components
│   └── index.html
└── docker-compose.yml
```

---

## Database Schema

- **users** – id, name, phone
- **categories** – id, name
- **sub_categories** – id, name, category_id
- **prompts** – id, user_id, category_id, sub_category_id, prompt, response, created_at

---

## How to Run Locally

### Option 1 – Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/tamarsubar/learning-platform.git
cd learning-platform

# 2. Create .env file in the backend folder
cp backend/.env.example backend/.env
# Edit .env and add your OpenAI API key

# 3. Start the database and backend
docker-compose up --build

# 4. In a separate terminal, start the frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000

---

### Option 2 – Run Manually

**Prerequisites:** Node.js 18+, PostgreSQL running locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The server will auto-create all tables and seed initial categories on first run.

---

## Environment Variables

See `backend/.env.example` for reference.

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI API key |

---

## Features

- User registration – name + phone (returning users are recognized by phone number)
- Category & sub-category selection – 6 categories with multiple topics each
- AI-powered lessons – prompts sent to OpenAI GPT and returned as lessons
- Learning history – all conversations saved per user in the database
- Admin dashboard – view all users and their full prompt history at `/admin`

---

## Assumptions

- No password authentication — users are identified by phone number
- The database is seeded automatically on first server start
- The frontend runs on Vite dev server (port 5173)
