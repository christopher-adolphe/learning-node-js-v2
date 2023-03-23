// const text = 'This text will be stored in a file using Deno';

// const encoder = new TextEncoder();
// const data = encoder.encode(text);

// Deno.writeFile('message.txt', data).then(() => {
//   console.log('Text written to file with Deno');
// });

import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';

await serve((request) => {
  new Response('Hello World');
}, { port: 3000 });
