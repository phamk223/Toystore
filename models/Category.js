const mongoose = require('mongoose');


// Định nghĩa schema cho loại sản phẩm
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo model từ schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;