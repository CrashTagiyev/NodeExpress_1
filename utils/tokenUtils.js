const jwt = require(`jsonwebtoken`);
const { JWT_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_INT } =
  process.env;

function generateAccessToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_INT,
  });
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
