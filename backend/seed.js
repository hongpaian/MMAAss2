// Chạy: npm run seed  -> xóa dữ liệu cũ và tạo dữ liệu mẫu
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const img = (seed) => `https://picsum.photos/seed/${seed}/600/400`;

const products = [
  { name: 'Phở bò tái', price: 55000, category: 'Món nước', description: 'Nước dùng hầm xương 12 tiếng, thịt bò tái mềm, hành lá, rau thơm.', image: img('pho') },
  { name: 'Bún chả Hà Nội', price: 50000, category: 'Món nước', description: 'Chả viên và chả miếng nướng than hoa, bún tươi, nước chấm chua ngọt.', image: img('buncha') },
  { name: 'Bún bò Huế', price: 52000, category: 'Món nước', description: 'Nước dùng sả, mắm ruốc đậm đà, giò heo và chả cua.', image: img('bunbo') },
  { name: 'Cơm tấm sườn bì chả', price: 60000, category: 'Món cơm', description: 'Sườn nướng mật ong, bì, chả trứng, mỡ hành và nước mắm.', image: img('comtam') },
  { name: 'Cơm gà xối mỡ', price: 58000, category: 'Món cơm', description: 'Da gà giòn rụm, cơm chiên vàng, dưa leo và canh.', image: img('comga') },
  { name: 'Bánh mì thịt nướng', price: 25000, category: 'Ăn nhẹ', description: 'Vỏ bánh giòn, thịt nướng, đồ chua, rau mùi.', image: img('banhmi') },
  { name: 'Gỏi cuốn tôm thịt', price: 35000, category: 'Ăn nhẹ', description: 'Tôm, thịt luộc, bún, rau sống cuốn bánh tráng, kèm mắm nêm.', image: img('goicuon') },
  { name: 'Trà sữa trân châu', price: 35000, category: 'Đồ uống', description: 'Trà đen sữa béo, trân châu đường đen dẻo.', image: img('trasua') },
  { name: 'Cà phê sữa đá', price: 22000, category: 'Đồ uống', description: 'Cà phê phin đậm vị pha sữa đặc, nhiều đá.', image: img('caphe') },
  { name: 'Nước cam ép', price: 30000, category: 'Đồ uống', description: 'Cam tươi vắt, không đường thêm.', image: img('cam') },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_order');
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
  await User.create({ name: 'Quản trị viên', email: 'admin@gmail.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Nguyễn Văn A', email: 'user@gmail.com', password: '123456', role: 'user' });
  await Product.insertMany(products);
  console.log('Seed xong!\n  Admin: admin@gmail.com / admin123\n  User : user@gmail.com / 123456');
  process.exit(0);
})();
