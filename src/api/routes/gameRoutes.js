import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import fakeDb from '../../database/database.js';

function validate(object, schema) {
  return Object.keys(schema)
    .filter(key => !schema[key](object[key]))
    .map(key => new Error(`${key} is invalid.`));
}

const gameSchema = {
  title: value => typeof value === 'string',
  price: n => n === +n && parseFloat(n) === n, // is number and float,
  year: n => `${n}`.length === 4, // check if has 4 characters
};

const gameRoutes = Router();

// show data
gameRoutes.get('/game/:id', auth, (req, res) => {
  if (Number.isNaN(Number(req.params.id))) {
    res.status(400);
  } else {
    const id = parseInt(req.params.id, 10);

    const game = fakeDb.games.find(g => g.id === id);

    if (game != undefined) {
      res.status(200).json(game);
    } else {
      res.status(404);
    }
  }
});

// create data
gameRoutes.post('/game', auth, (req, res) => {
  const { title, price, year } = req.body;
  const errors = validate({ title, price, year }, gameSchema);

  if (errors.length !== 0) {
    const invalidFields = errors.map(error => error.message).join(', ');
    const message = `Os seguintes campos estão no formato errado: ${invalidFields}`;
    return res.status(400).send({ message });
  }
  // tudo certo
  fakeDb.games.push({
    id: fakeDb.games.length + 1,
    title,
    price,
    year,
  });

  return res.sendStatus(200);
});

// Delete Data
gameRoutes.delete('/game/:id', auth, (req, res) => {
  if (Number.isNaN(Number(req.params.id))) {
    res.status(400);
  } else {
    const id = parseInt(req.params.id, 10);
    const index = fakeDb.games.findIndex(g => g.id == id);

    if (index == -1) {
      res.status(404);
    } else {
      fakeDb.games.splice(index, 1);
      res.status(200);
    }
  }
});
// Edit data
gameRoutes.put('/game/:id', auth, (req, res) => {
  if (Number.isNaN(Number(req.params.id))) {
    res.status(400);
  } else {
    const id = parseInt(req.params.id, 10);

    const game = fakeDb.games.find(g => g.id === id);

    if (game != undefined) {
      const { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.status(200);
    } else {
      res.status(404);
    }
  }
});

export default gameRoutes;
