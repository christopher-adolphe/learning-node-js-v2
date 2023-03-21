import { Router } from 'express';
import { Todo } from '../models/todo';

type RequestBody = { text: string };
type RequestParams = { id: string };

let todos: Todo[] = [];

const router = Router();

router.get('/', (request, response, next) => {
  response.status(200).json({ todos });
});

router.post('/', (request, response, next) => {
  const { text } = request.body as RequestBody;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);

  response.status(201).json({ message: 'New Todo was successfully added', todos });
});

router.put('/:id', (request, response, next) => {
  const { id } = request.params as RequestParams;
  const { text } = request.body as RequestBody;
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex >= 0) {
    todos[todoIndex] = { ...todos[todoIndex], text };

    return response.status(200).json({ message: `Todo with id: ${id} was successfully updated`, todos })
  }

  response.status(404).json({ message: `Sorry, could not find Todo with this id: ${id} to update` });
});

router.delete('/:id', (request, response, next) => {
  const { id } = request.params as RequestParams;
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex >= 0) {
    todos = todos.filter(todo => todo.id !== id);

    return response.status(200).json({ message: `Todo with id: ${id} was successfully deleted`, todos })
  }

  response.status(404).json({ message: `Sorry, could not find Todo with this id: ${id} to delete` });
});

export default router;
