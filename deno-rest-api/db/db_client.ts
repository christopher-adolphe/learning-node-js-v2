import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.31.1/mod.ts';

let db: Database;

export async function connect() {
  const client = new MongoClient();

  await client.connect('mongodb://localhost:27017');

  db = client.database('todos-app');
}

export function getDB() {
  return db;
}
