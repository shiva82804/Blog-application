const jwt = require("jsonwebtoken");
const secret = "@superman123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileURL: user.profileURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
