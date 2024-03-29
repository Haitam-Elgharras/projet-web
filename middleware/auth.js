// this middleware is to check if the user is authentificated or not
const jwt = require("jsonwebtoken");
const config = require("config");
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  //we get the token from the header of the request
  const token = req.header("x-auth-token");
  //if there is no token
  if (!token) return res.status(401).send("access denied no token provided");
  try {
    //if there is a token we need to verify it
    // const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    //when we decode the token we get an object that contains information about the user and the private key
    // so we store the decoded object in the req.user to use it in the next middleware
    req.user = decoded;
    next();
  } catch (ex) {
    //if the token is not valid we send a bad request
    res.status(400).send("invalid token");
  }
}

module.exports = auth;
