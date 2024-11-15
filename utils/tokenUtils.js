const User = require("../models/userModel");

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

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    res.locals.user = user;
    req.user = user.id;
    next();
  });
}

function verifyIsAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(401);

    const searchedUser = await User.findById(user.id);
    if (!searchedUser) return res.sendStatus(404);

    if (searchedUser.isAdmin) next();
    else return res.sendStatus(401);
  });
}

module.exports = {
  verifyIsAdmin,
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
