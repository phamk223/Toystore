const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;