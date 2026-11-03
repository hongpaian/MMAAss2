require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Web admin (HTML tĩnh) -> http://localhost:5000/admin
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

app.get('/', (req, res) => res.json({ message: 'Food Order API đang chạy' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy API' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'CastError') return res.status(400).json({ message: 'ID không hợp lệ' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({ message: err.message || 'Lỗi server' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_order';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server chạy tại http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('Không kết nối được MongoDB:', e.message);
    process.exit(1);
  });
