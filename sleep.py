from pydantic import BaseModel

class Sleep(BaseModel):
    id: int
    date: str
    timeToSleep: str
    timeAwake: str

class SleepRequest(BaseModel):
    date: str
    timeToSleep: str
    timeAwake: str