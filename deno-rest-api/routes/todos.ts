import { Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { Bson, ObjectId } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

import { getDB } from '../db/db_client.ts';

const router = new Router({
  prefix: '/todos',
});

interface TodoSchema {
  _id: ObjectId;
  text: string;
}

interface Todo {
  id?: string;
  text: string;
};

let todos: Todo[] = [];

router.get('/', async (context) => {
  const todos: TodoSchema[]  = await getDB().collection<TodoSchema>('todos').find().toArray();
  const transformedTodos = todos.map(todo => ({ id: todo._id.toString(), text: todo.text }));

  context.response.body = { todos: transformedTodos };
});

router.post('/', async (context) => {
  const data = await context.request.body();
  const { text } = await data.value;

  // const newTodo: Todo = {
  //   id: new Date().toISOString(),
  //   text,
  // };

  // todos.push(newTodo);

  const newTodo: Todo = {
    text,
  };

  const newTodoId = await getDB().collection('todos').insertOne(newTodo);

  newTodo.id = newTodoId.$oid;

  context.response.body = { message: 'New Todo successfully added', todos };
});

router.put('/:id', async (context) => {
  const { id } = context.params;
  // const todoIndex = todos.findIndex(todo => todo.id === id);

  // if (todoIndex >= 0) {
  //   const data = await context.request.body();
  //   const { text } = await data.value;

  //   todos[todoIndex] = { ...todos[todoIndex], text };

  //   return context.response.body = { message: `Todo with id: ${id} successfully updated`, todos };
  // }

  const todo = await getDB().collection('todos').findOne({ _id: new Bson.ObjectId(id) });

  if (todo) {
    const data = await context.request.body();
    const { text } = await data.value;

    const result = await getDB().collection('todos').updateOne(
      { _id: new Bson.ObjectId(id) },
      { $set: { text } }
    );

    console.log('updated todo: ', result);

    return context.response.body = { message: `Todo with id: ${id} successfully updated`, todo: result };
  }

  context.response.body = { message: `Sorry, no Todo with id: ${id} found` };
});

router.delete('/:id', async (context) => {
  const { id } = context.params;
  // const todoIndex = todos.findIndex(todo => todo.id === id);

  // if (todoIndex >= 0) {
  //   todos = todos.filter(todo => todo.id !== id);

  //   return context.response.body = { message: `Todo with id: ${id} successfully deleted`, todos };
  // }

  const todo = await getDB().collection('todos').findOne({ _id: new Bson.ObjectId(id) });

  if (todo) {
    await getDB().collection('todos').deleteOne({ _id: new Bson.ObjectId(id) });

    return context.response.body = { message: `Todo with id: ${id} successfully deleted`, todo };
  }

  context.response.body = { message: `Sorry, no Todo with id: ${id} found` };
});

export default router;
