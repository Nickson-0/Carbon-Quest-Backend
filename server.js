const express = require('express');
const consola = require('consola');
const bodyParser = require('body-parser');
const middlewareCors = require('./middleware/cors');
const apiRouter = require('./routes');
const { config } = require('./config.js');
const sockerController = require('./socker/sockerController');

const app = express();

const connectDB = require('./config/db.config.js');

// Connect Database
connectDB();

// Aviod cors through middleware
app.use(middlewareCors.allowAll);

app.use(bodyParser.urlencoded({ extended: false }));
// Init Middleware
app.use(express.json());
app.use('/', apiRouter);

app.get('/', (request, response) => {
  response.json({ message: 'Hello from Carbon Server!' });
});

// set port, listen for requests
// const port = process.env.PORT || 8080;

const http = require('http').Server(app);
sockerController.app(http);

http.listen(process.env.PORT || 8080, '0.0.0.0', () => {
  console.log(`Socket is listening!`);
});
