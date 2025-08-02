# 🔁 SkillSwap – Learn & Teach Skills Seamlessly

SkillSwap is a full-stack web application that allows users to **sign up**, **log in**, and **post skills** they can teach or want to learn. Whether you're a data science expert or a photography enthusiast, SkillSwap helps you connect with like-minded learners and mentors.

---

## ✨ Features

- ✅ User signup and login (with JWT authentication)
- 🔐 Protected user endpoints (view your info, delete account)
- 🎓 Post a skill (Can Teach or Want to Learn)
- 📚 View all posted skills
- 📋 View all registered users
- 💥 Clean, responsive frontend using **React + Vite**
- 🚀 Fast backend powered by **FastAPI** and **SQLAlchemy**

---

## 🖼️ Tech Stack

| Frontend   | Backend     | Database    | Auth     |
|------------|-------------|-------------|----------|
| React + Vite | FastAPI      | SQLite       | JWT      |

-

## 🚀 Getting Started (Dev)

### 1. Clone the repo

```bash
git clone https://github.com/AayushA10/skillswap.git
cd skillswap

-->Set up the backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python create_tables.py  # Creates SQLite DB and tables
uvicorn app.main:app --reload

-->Set up the frontend
cd ../frontend
npm install
npm run dev



