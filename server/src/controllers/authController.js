const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const { apiError } = require('../utils/apiError');
const { validateEmail } = require('../utils/validation');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function setAuthCookie(res, token) {
  res.cookie(config.cookie.name, token, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    maxAge: config.cookie.maxAge,
  });
}

async function login(req, res, next) {
  try {
    const email = validateEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!password) throw apiError(400, 'Password is required.');

    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) throw apiError(401, 'Invalid email or password.');

    const ok = await user.comparePassword(password);
    if (!ok) throw apiError(401, 'Invalid email or password.');

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    setAuthCookie(res, token);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie(config.cookie.name);
  res.json({ message: 'Logged out.' });
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'lastLoginAt'],
    });
    if (!user) throw apiError(401, 'Account not found.');
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me, signToken, setAuthCookie };