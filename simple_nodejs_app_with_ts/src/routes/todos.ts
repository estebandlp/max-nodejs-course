import { Router } from "express";
import { Todo } from "../models/todo";

let todos: Todo[] = [];

type requestBody = { text: string };
type requestParams = { todoId: string };

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Say hi!", todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as requestBody;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({ message: "Created!", todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const reqParams = req.params as requestParams;
  const body = req.body as requestBody;
  const todoIndex = todos.findIndex(
    (todoItem) => todoItem.id === reqParams.todoId
  );

  if (todoIndex >= 0) {
    todos[todoIndex] = {
      id: todos[todoIndex].id,
      text: body.text,
    };

    res.status(200).json({ message: "Updated!", todos: todos });
  }

  res.status(404).json({ message: "Not found!" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  todos = todos.filter((todoItem) => todoItem.id !== req.params.todoId);
  res.status(200).json({ message: "Deleted!", todos: todos });
});

export default router;
