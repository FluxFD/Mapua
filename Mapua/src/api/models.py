from typing import Optional
from uuid import UUID, uuid4
from pydantic import BaseModel
from enum import Enum

class Role(str, Enum):
    moderator = "moderator"
    teacher = "teacher"
    student = "student"    

class LoginStatus(str, Enum):
    loggedin = "loggedin"
    loggedout = "loggedout"
    
class User(BaseModel):
    id: Optional[UUID] = uuid4()
    name: str
    email: str
    password: str
    role: str
    login_status: str
