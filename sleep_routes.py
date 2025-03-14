from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, status

from sleep import Sleep, SleepRequest

max_id: int = 0

sleep_router = APIRouter()

sleep_list = []

@sleep_router.get("")
async def get_sleeps() -> list[Sleep]:
    return sleep_list

@sleep_router.post("", status_code=status.HTTP_201_CREATED)
async def add_sleep(sleep: SleepRequest) -> Sleep:
    global max_id
    max_id += 1  # auto increment max_id
    newSleep = Sleep(id=max_id, date=sleep.date, timeToSleep=sleep.timeToSleep, timeAwake=sleep.timeAwake)
    sleep_list.append(newSleep)
    return newSleep

@sleep_router.get("/{id}")
async def get_sleep_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> Sleep:
    for sleep in sleep_list:
        if sleep.id == id:
            return sleep

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )

@sleep_router.delete("/{id}")
async def delete_sleep_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> dict:
    for i in range(len(sleep_list)):
        sleep = sleep_list[i]
        if sleep.id == id:
            sleep_list.pop(i)
            return {"msg": f"The sleep with ID={id} is removed."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )