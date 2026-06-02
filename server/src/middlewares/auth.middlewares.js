import userModel from '../models/user.model';
import jwt from 'jsonwebtoken';


async function authMiddleware(req, res, next) {
  const token =
      req.cookies.token ||
      req.headers.authorization?.split(' ')[1]; // Extracting token from cookies or Authorization header

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized access,token is missing!!!',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //user id comes

    const user = await userModel.findById(decoded.userId);
    if(!user){
      return res.status(401).json({
      message:"User not found"
    })
  }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized access,token is Invalid!!!',
    });
  }
}

export { authMiddleware };