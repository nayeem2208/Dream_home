import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
import usermodel from "../modals/userModal.js";

const authcheck =  async (req, res, next) => {


  // Retrieve the token from the "Authorization" header
  const token = req.headers.authorization;

  if (token) {
    try {
      // Remove the "Bearer " prefix from the token (if present)
      const tokenWithoutBearer = token.replace("Bearer ", "");

      // Verify the token
      const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

      // Fetch user details and attach to the request
      req.user = await usermodel.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json(error)
      
    }
  } else {
    res.status(401).json(error)
    
  }
};

export default authcheck;
