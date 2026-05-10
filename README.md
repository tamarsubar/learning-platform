# AI-Driven Learning Platform 🎓

A mini learning platform that allows users to select topics, interact with an AI tutor, and review their learning history.

---

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL + Sequelize ORM  
**AI:** OpenAI GPT API  

---

## Project Structure

learning-platform/
├── frontend/         # React + TypeScript app
│   └── src/
│       ├── pages/    # Signup, Categories, Subcategories, Chat, History, Admin
│       └── App.tsx
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
└── README.md

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Clone the repository
git clone <your-repo-url>
cd learning-platform

### 2. Setup Backend
cd backend
npm install

Create a .env file:
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/learning_platform_db
OPENAI_API_KEY=your_openai_api_key

Run the backend:
npm run dev

### 3. Setup Frontend
cd frontend
npm install
npm run dev

---

## Features

- User Registration — name and phone number
- Category Selection — loaded dynamically from the database
- Sub-category Selection — filtered by category
- AI Chat — send prompts and receive lesson-like responses
- Learning History — view all past prompts and responses per user
- Admin Dashboard — view all users and their learning history at /admin

---

## API Endpoints

POST   /api/users/register         Register a new user
GET    /api/categories             Get all categories with subcategories
POST   /api/learning/chat          Send prompt to AI
GET    /api/learning/history/:userId  Get user learning history
GET    /api/admin/users            Get all users with prompts (admin)

---

## Assumptions

- No authentication (JWT) implemented in this version
- First user is created on signup; userId is stored in localStorage
- Database is seeded automatically on first run with sample categories
- AI integration uses OpenAI GPT-3.5-turbo (can be swapped via aiService.js)

---

## Sample .env

PORT=5000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/learning_platform_db
OPENAI_API_KEY=sk-...