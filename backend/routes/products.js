const router = require('express').Router();
const Product = require('../models/Product');
const { wrap, protect, adminOnly } = require('../middleware/auth');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?search=&category=&all=true
router.get(
  '/',
  wrap(async (req, res) => {
    const { search, category, all } = req.query;
    const filter = {};
    if (all !== 'true') filter.available = true;
    if (search) filter.name = new RegExp(escapeRegex(search), 'i');
    if (category && category !== 'Tất cả') filter.category = category;
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  })
);

// GET /api/products/categories
router.get(
  '/categories',
  wrap(async (req, res) => {
    res.json(await Product.distinct('category', { available: true }));
  })
);

// GET /api/products/:id
router.get(
  '/:id',
  wrap(async (req, res) => {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Không tìm thấy món' });
    res.json(p);
  })
);

// ---- Admin CRUD ----
router.post(
  '/',
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const { name, description, price, image, category, available } = req.body;
    res.status(201).json(
      await Product.create({ name, description, price, image, category, available })
    );
  })
);

router.put(
  '/:id',
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const { name, description, price, image, category, available } = req.body;
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category, available },
      { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ message: 'Không tìm thấy món' });
    res.json(p);
  })
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  wrap(async (req, res) => {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Không tìm thấy món' });
    res.json({ message: 'Đã xóa món' });
  })
);

module.exports = router;
