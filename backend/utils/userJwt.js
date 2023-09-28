import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent JavaScript access to the cookie
    secure: true,   // Only send the cookie over HTTPS (in production)
    sameSite: "strict", // Helps prevent cross-site request forgery (CSRF) attacks
  });
  
};

export default generateToken;
