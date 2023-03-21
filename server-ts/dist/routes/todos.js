"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let todos = [];
const router = (0, express_1.Router)();
router.get('/', (request, response, next) => {
    response.status(200).json({ todos });
});
router.post('/', (request, response, next) => {
    const { text } = request.body;
    const newTodo = {
        id: new Date().toISOString(),
        text,
    };
    todos.push(newTodo);
    response.status(201).json({ message: 'New Todo was successfully added', todos });
});
router.put('/:id', (request, response, next) => {
    const { id } = request.params;
    const { text } = request.body;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex >= 0) {
        todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { text });
        return response.status(200).json({ message: `Todo with id: ${id} was successfully updated`, todos });
    }
    response.status(404).json({ message: `Sorry, could not find Todo with this id: ${id} to update` });
});
router.delete('/:id', (request, response, next) => {
    const { id } = request.params;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex >= 0) {
        todos = todos.filter(todo => todo.id !== id);
        return response.status(200).json({ message: `Todo with id: ${id} was successfully deleted`, todos });
    }
    response.status(404).json({ message: `Sorry, could not find Todo with this id: ${id} to delete` });
});
exports.default = router;
