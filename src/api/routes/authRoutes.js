import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWTSecret } from '../middlewares/auth.js';
import fakeDb from '../../database/database.js';

const authRoutes = Router();

authRoutes.post('/', (req, res) => {
  const { email, password } = req.body;

  if (email != undefined) {
    // o u aqui se refere ao user do DB
    const user = fakeDb.users.find(u => u.email === email);

    if (user != undefined) {
      if (user.password === password) {
        jwt.sign(
          { id: user.id, email: user.email },
          JWTSecret,
          {
            expiresIn: '48h',
          },
          (err, token) => {
            if (err) {
              res.status(400).json({ err: 'Falha Interna' });
            } else {
              res.status(200).json({ token });
            }
          }
        );
      } else {
        // em caso de senha errada
        res.status(401).json({ err: 'Credenciais inválidas' });
      }
    } else {
      res
        .status(404)
        .json({ error: 'O E-mail enviado não existe na base de dados' });
    }
  } else {
    res.status(400).json({ error: 'O E-mail enviado é inválido' });
  }
});

export default authRoutes;
