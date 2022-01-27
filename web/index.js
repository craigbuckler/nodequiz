// initialize questions database
import { quizQuestionCount } from './lib/init.js';

import { hostname } from 'os';

// Express.js application
import express from 'express';
import compression from 'compression';

import { formRoute } from './routes/form.js';

// configuration
const cfg = {
  dev: ((process.env.NODE_ENV).trim().toLowerCase() !== 'production'),
  port: process.env.NODE_PORT || 8000
};

// Express initiation
const app = express();

// use EJS templates
app.set('view engine', 'ejs');
app.set('views', 'views');

// GZIP
app.use(compression());

// body parsing
app.use(express.urlencoded({ extended: true }));

// home page
app.get('/', (req, res) => {
  res.render('message', { title: 'Hello World! ' + hostname });
});

// question count
app.get('/count/', async (req, res) => {
  res.render('message', { title: 'question count: ' + quizQuestionCount });
});

// chat page
app.get('/chat/', (req, res) => {
  res.render('chat', { title: 'chat', wsHost: process.env.QUIZ_WS_DOMAIN });
});

// routes
app.use('/form/', formRoute);

// static assets
app.use(express.static('static'));

// 404 error
app.use((req, res) => {
  res.status(404).render('message', { title: 'Not found' });
});

app.listen(cfg.port, () => {
  console.log(`Server listening at http://localhost:${ cfg.port }`);
});

export { cfg, express, app };
