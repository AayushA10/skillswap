from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ==========================
# USER SCHEMAS
# ==========================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: int | None = None

# ==========================
# SKILL SCHEMAS
# ==========================

class SkillBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str  # "teach" or "learn"

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
