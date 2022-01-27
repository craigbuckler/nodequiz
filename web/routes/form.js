import { express } from '../index.js';
export const formRoute = express.Router();

// GET request
formRoute.get('/', (req, res, next) => {

  res.render(
    'form',
    {
      title: 'Example form (GET received)',
      get: JSON.stringify(req.query),
      post: null,
      body: {}
    });

});

// POST request
formRoute.post('/', (req, res, next) => {

  res.render(
    'form',
    {
      title: 'Example form (POST received)',
      get: JSON.stringify(req.query),
      post: JSON.stringify(req.body),
      body: req.body
    });

});
