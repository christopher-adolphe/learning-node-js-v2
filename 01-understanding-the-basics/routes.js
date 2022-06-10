const users = ['Angela', 'Paul'];

const requestHandler = (request, response) => {
  const { url, method } = request;
  const pageStart = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NodeJS Assigment 1</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
        
        <style>
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }

          body {
            min-height: 100vh;
            font-family: 'Montserrat', sans-serif;
          }

          .app {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .form button {
            padding: 0.5rem 1rem;
          }

          .form__group {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            margin-bottom: 2rem;
          }

          .form-group label {
            display: inline-block;
            margin-bottom: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="app">
  `;

  const pageEnd = `
        </div>
      </body>
    </html>
  `;

  let bodyContent;

  if (url === '/') {
    bodyContent = `
      <h1>👋 Welcome to NodeJS Basics 👋</h1>

      <form class="form" action="/create-user" method="POST">
        <div class="form__group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>

        <button type="submit">Add user</button>
      </form>
    `;

    const htmlPage = `
      ${pageStart}

      ${bodyContent}

      ${pageEnd}
    `;

    response.setHeader('Content-Type', 'text/html');
    response.write(htmlPage);

    return response.end();
  }

  if (url === '/users') {
    bodyContent = `
      <h1>Users</h1>
      ${users.length ? `
      <ul>
        ${users.map(user => `<li>${user}</li>`).join('')}
      </ul>` : `<p>Sorry, there are no users.</p>`}
    `;

    const htmlPage = `
      ${pageStart}

      ${bodyContent}
      
      ${pageEnd}
    `;

    response.setHeader('Content-Type', 'text/html');
    response.write(htmlPage);

    return response.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    let newUser = '';

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      newUser = parsedBody.split('=')[1];

      users.push(newUser);

      bodyContent = `
        <h1>🎉 New user ${newUser} successfully created 🎉</h1>

        <p>Click here to <a href="/users">view users list</a>.</p>
      `;

      const htmlPage = `
        ${pageStart}

        ${bodyContent}
        
        ${pageEnd}
      `;

      response.setHeader('Content-Type', 'text/html');
      response.write(htmlPage);
      return response.end();
    });

    // response.statusCode = 302;
    // response.setHeader('Location', '/');
    // response.end();
  }
};

module.exports = requestHandler;
