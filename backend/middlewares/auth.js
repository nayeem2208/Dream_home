import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

const authcheck = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

export default authcheck;
