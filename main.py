from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sleep_routes import sleep_router

app = FastAPI(title="My Sleep Tracker")
app.include_router(sleep_router, tags=["Sleeps"], prefix="/sleeps")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

@app.get("/")
async def welcome() -> dict:
    return FileResponse("./frontend/index.html")

app.mount("/", StaticFiles(directory="frontend"), name="static")