from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database, auth

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===========================
# POST a new skill
# ===========================
@router.post("/", response_model=schemas.SkillOut)
def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_skill = models.Skill(
        title=skill.title,
        description=skill.description,
        type=skill.type,
        user_id=current_user.id
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

# ===========================
# GET current user's skills
# ===========================
@router.get("/my", response_model=list[schemas.SkillOut])
def get_my_skills(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Skill).filter(models.Skill.user_id == current_user.id).all()

# ===========================
# GET all skills
# ===========================
@router.get("/all", response_model=list[schemas.SkillOut])
def get_all_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).all()
