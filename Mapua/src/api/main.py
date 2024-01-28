from typing import List
from uuid import uuid4
from fastapi import FastAPI
from models import LoginStatus, Role, User


app = FastAPI()

db: List[User] = [
    User(
        id=uuid4(),
        name="Juan Dela Cruz",
        email="jdelacruz@test.com",
        password="testpassword",
        role=[Role.student],
        login_status=[LoginStatus.loggedout],
    )
]

@app.get("/")
async def root():
    return {"Hello": "World"}

@app.get("/api/v1/users")
async def fetch_users():
    return db;