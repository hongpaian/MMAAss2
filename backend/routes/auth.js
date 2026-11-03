const router = require('express').Router();
const User = require('../models/User');
const { wrap, signToken, protect } = require('../middleware/auth');

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

// POST /api/auth/register
router.post(
  '/register',
  wrap(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đủ tên, email, mật khẩu' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const user = email && (await User.findOne({ email: email.toLowerCase() }));
    if (!user || !(await user.matchPassword(password || '')))
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    res.json({ token: signToken(user), user: publicUser(user) });
  })
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
