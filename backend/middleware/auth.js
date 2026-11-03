const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = () => process.env.JWT_SECRET || 'dev_secret_change_me';

// Bọc async handler để lỗi được chuyển vào error middleware
exports.wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.signToken = (user) => jwt.sign({ id: user._id }, SECRET(), { expiresIn: '7d' });

exports.protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    const decoded = jwt.verify(token, SECRET());
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Phiên đăng nhập hết hạn, hãy đăng nhập lại' });
  }
};

exports.adminOnly = (req, res, next) =>
  req.user && req.user.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'Chỉ admin mới được thực hiện' });
