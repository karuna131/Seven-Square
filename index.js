const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const routes = require('./src/routes/index');
const router = express.Router();

app.get('/', (req, res) => {
  res.send('Running');
});

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true,
}));


routes(app, router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
