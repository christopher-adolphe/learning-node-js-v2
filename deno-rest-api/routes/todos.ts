import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';

const router = new Router({
  prefix: '/todos',
});

interface Todo {
  id: string;
  text: string;
};

let todos: Todo[] = [];

router.get('/', (context) => {
  context.response.body = { todos };
});

router.post('/', async (context) => {
  const data = await context.request.body();
  const { text } = await data.value;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text,
  };

  todos.push(newTodo);

  context.response.body = { message: 'New Todo successfully added', todos };
});

router.put('/:id', async (context) => {
  const { id } = context.params;
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex >= 0) {
    const data = await context.request.body();
    const { text } = await data.value;

    todos[todoIndex] = { ...todos[todoIndex], text };

    return context.response.body = { message: `Todo with id: ${id} successfully updated`, todos };
  }

  context.response.body = { message: `Sorry, no Todo with id: ${id} found` };
});

router.delete('/:id', (context) => {
  const { id } = context.params;
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex >= 0) {
    todos = todos.filter(todo => todo.id !== id);

    return context.response.body = { message: `Todo with id: ${id} successfully deleted`, todos };
  }

  context.response.body = { message: `Sorry, no Todo with id: ${id} found` };
});

export default router;
