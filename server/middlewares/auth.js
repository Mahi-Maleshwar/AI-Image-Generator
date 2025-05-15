import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;  // Correct way
  
  let token;
  if (authHeader ||  authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  else if (req.query.token) {
    token = req.query.token;
  }

  if(!token) {
    return res.json({success: false, message: 'Not Authorized. Login Again'})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token: ", decoded)
    
    if (decoded.id) {
      req.user = { id: decoded.id }; // Store decoded user id inside req.user
      next();
    } else {
      return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }
  } catch (error) {
    console.log("JWT Error: ", error.message)
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
