const express = require('express');
const path = require('path');
const db = require('./utils/database');

const app = express();
const port = process.env.PORT || 3000;

const shopRouter = require('./routes/shop-router');
const adminRouter = require('./routes/admin-router');
const errorRouter = require('./routes/error-router');

db.execute('SELECT * FROM products')
  .then(result => console.log(result[0]))
  .catch(error => console.log(error));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);

app.listen(port, () => {
  console.log(`Server listening... http://localhost:${port}`);
});
