from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, skills

app = FastAPI()

# CORS setup (for React connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(skills.router, prefix="/skills", tags=["Skills"])

@app.get("/")
def root():
    return {"message": "🔥 SkillSwap API is Live!"}
