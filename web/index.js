// Express.js
import express from 'express';
import compression from 'compression';

// modules
import { questionCount } from './libshared/quizdb.js';
import { questionsImport } from './lib/questionsimport.js';

// configuration
const cfg = {
  dev: ((process.env.NODE_ENV).trim().toLowerCase() !== 'production'),
  port: process.env.NODE_PORT || 8000,
  domain: process.env.QUIZ_WEB_DOMAIN,
  title: process.env.QUIZ_TITLE,
  questionsMax: parseInt(process.env.QUIZ_QUESTIONS_MAX, 10)
};

// Express initiation
const app = express();

// use EJS templates
app.set('view engine', 'ejs');
app.set('views', 'views');

// body parsing
app.use(express.urlencoded({ extended: true }));

// GZIP
app.use(compression());

// body parsing
app.use(express.urlencoded({ extended: true }));

// home page
app.get('/', async (req, res) => {

  if (typeof req.query.import !== 'undefined') {

    // import new questions and redirect back
    res.redirect(`/?imported=${ await questionsImport() }`);

  }
  else {

    // home page template
    res.render('home', {
      title: cfg.title,
      questions: await questionCount(),
      questionsMax: cfg.questionsMax,
      imported: req.query?.imported || null
    });

  }

});

// create a new game
app.post('/new', async (req, res) => {

});

// static assets
app.use(express.static('static'));

// 404 error
app.use((req, res) => {
  res.status(404).render('message', { title: 'Not found' });
});

app.listen(cfg.port, () => {
  console.log(`Server started at ${ cfg.domain }`);
});

export { cfg, express, app };
