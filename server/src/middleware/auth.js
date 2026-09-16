const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

/**
 * Protects an admin route. Reads the JWT from the `Authorization: Bearer`
 * header or from the auth cookie (so the admin dashboard can use cookies).
 */
async function requireAuth(req, res, next) {
  try {
    let token = null;

    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.slice(7);
    } else if (req.cookies && req.cookies[config.cookie.name]) {
      token = req.cookies[config.cookie.name];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(payload.sub);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Account is inactive or does not exist.' });
    }

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = requireAuth;