const jwt = require('jsonwebtoken');
module.exports = function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Missing token' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
7
req.user = { id: payload.id, email: payload.email };
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
};