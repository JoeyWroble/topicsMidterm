from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, status

from todo import Todo, TodoRequest

max_id: int = 0

todo_router = APIRouter()

todo_list = []


@todo_router.get("")
async def get_todos() -> list[Todo]:
    return todo_list


@todo_router.post("", status_code=status.HTTP_201_CREATED)
async def add_todo(todo: TodoRequest) -> Todo:
    global max_id
    max_id += 1  # auto increment max_id
    newTodo = Todo(id=max_id, date=todo.date, timeToSleep=todo.timeToSleep, timeAwake=todo.timeAwake)
    todo_list.append(newTodo)
    return newTodo


@todo_router.get("/{id}")
async def get_todo_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> Todo:
    for todo in todo_list:
        if todo.id == id:
            return todo

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )


@todo_router.delete("/{id}")
async def delete_todo_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> dict:
    for i in range(len(todo_list)):
        todo = todo_list[i]
        if todo.id == id:
            todo_list.pop(i)
            return {"msg": f"The todo with ID={id} is removed."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )