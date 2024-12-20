import jwt from 'jsonwebtoken';
//The jsonwebtoken library is imported to work with JWTs.


const { verify } = jwt;
//The verify function from jsonwebtoken is used to validate the token.


//The function checks for the Authorization header in the request:
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }


  //Authorization: Bearer <token> JWT token format

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Invalid token format.' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;   //The decoded payload (user information) is stored in req.user
   
    next();               //called to proceed to the next middleware or route handler. 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default authenticateToken;
