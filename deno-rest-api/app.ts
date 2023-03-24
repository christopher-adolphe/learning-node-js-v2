import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
// import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts;

import { connect } from './db/db_client.ts';

import todosRoutes from './routes/todos.ts';

connect();

const app = new Application();

// Enabling CORS using oakCors
// app.use(oakCors());

// Enabling CORS by manually setting the proper headers
app.use(async (context, next) => {
  context.response.headers.set('Access-Control-Allow-Origin', '*');
  context.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  context.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 8000 });
