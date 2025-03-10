from pydantic import BaseModel


class Todo(BaseModel):
    id: int
    date: str
    timeToSleep: str
    timeAwake: str


class TodoRequest(BaseModel):
    date: str
    timeToSleep: str
    timeAwake: str