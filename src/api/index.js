import express from 'express';
import cors from 'cors';
import { auth } from './middlewares/auth.js';
import fakeDb from '../database/database.js';

// routes
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

const app = express();
const PORT = 4445;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/games', auth, (req, res) => {
  res.status(200).json({ gameList: fakeDb.games });
});

app.use('/game/:id', gameRoutes); // GET
app.use('/game', gameRoutes); // POST
app.use('/game/:id', gameRoutes); // DELETE
app.use('/game/:id', gameRoutes); // PUT

// login
app.use('/auth', authRoutes);

app.listen(PORT, () =>
  console.log(`API started at http://localhost:${PORT} 🚀`)
);
