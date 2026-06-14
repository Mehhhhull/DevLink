import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';


async function authMiddleware(req, res, next) {
  const token =
      req.cookies.token ||
      req.headers.authorization?.split(' ')[1]; // Extracting token from cookies or Authorization header

  if (!token) {
    console.log('Auth middleware: No token found in cookies or headers');
    return res.status(401).json({
      message: 'Unauthorized access, token is missing!!!',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //user id comes
    console.log('Auth middleware: Token decoded successfully, userId:', decoded.userId);

    const user = await User.findById(decoded.userId);
    if(!user){
      console.log('Auth middleware: User not found for id:', decoded.userId);
      return res.status(401).json({
      message:"User not found"
    })
  }

    req.user = user;
    console.log('Auth middleware: User authenticated:', user.email);

    return next();
  } catch (error) {
    console.log('Auth middleware: Token verification failed:', error.message);
    return res.status(401).json({
      message: 'Unauthorized access, token is Invalid!!!',
    });
  }
}

export { authMiddleware };