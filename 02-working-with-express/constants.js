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

const products = [];

module.exports = {
  pageStart,
  pageEnd,
  products
};
