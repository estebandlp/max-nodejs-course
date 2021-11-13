"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var todos = [];
var router = (0, express_1.Router)();
router.get("/", function (req, res, next) {
    res.status(200).json({ message: "Say hi!", todos: todos });
});
router.post("/todo", function (req, res, next) {
    var newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({ message: "Created!", todos: todos });
});
router.put("/todo/:todoId", function (req, res, next) {
    var tid = req.params.todoId;
    var todoIndex = todos.findIndex(function (todoItem) { return todoItem.id === tid; });
    if (todoIndex >= 0) {
        todos[todoIndex] = {
            id: todos[todoIndex].id,
            text: req.body.text,
        };
        res.status(200).json({ message: "Updated!", todos: todos });
    }
    res.status(404).json({ message: "Not found!" });
});
router.delete("/todo/:todoId", function (req, res, next) {
    todos = todos.filter(function (todoItem) { return todoItem.id !== req.params.todoId; });
    res.status(200).json({ message: "Deleted!", todos: todos });
});
exports.default = router;
