import jwt from 'jsonwebtoken';

const JWTSecret = 'herewego';

function auth(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).json({ err: 'Invalid Token!' });
  const token = authToken.split(' ')[1];
  return jwt.verify(token, JWTSecret, (error, tokenData) => {
    if (error) return res.status(401).json({ err: 'Invalid Token!' });
    console.log(tokenData);
    req.token = token;
    req.loggedUser = { id: tokenData.id, gmail: tokenData.email };
    return next();
  });
}

export { auth, JWTSecret };
