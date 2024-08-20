const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
const Category = require('../models/Category');

// Route để lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
      const products = await Product.find().populate('category'); // Sử dụng populate đúng cách
      console.log(products); // Kiểm tra dữ liệu
      res.render('Product', { products });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

router.get('/add', async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy danh sách các danh mục
        res.render('Product/create', { categories }); // Gửi danh sách danh mục đến view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
  

// Route để xử lý thêm sản phẩm
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            category, // Đảm bảo giá trị category là ObjectId hợp lệ
            stock,
            imageUrl
        });
        await newProduct.save();
        res.redirect('/product'); // Điều hướng về trang danh sách sản phẩm hoặc trang khác sau khi thêm thành công
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Route để hiển thị form chỉnh sửa sản phẩm
router.get('/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId)
        const product = await Product.findById(productId).populate('category'); // Tìm sản phẩm theo ID và populate danh mục
        if (!product) {
            return res.status(404).send('Product not found');
        }
        const categories = await Category.find(); // Lấy danh sách các danh mục
        
        categories.forEach(category => {
            category.isSelected = (category._id.toString() === product.category._id.toString());
        });
        res.render('Product/edit', { product, categories }); // Gửi thông tin sản phẩm và danh mục đến view
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route để xử lý cập nhật sản phẩm
router.post('/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, category, stock, imageUrl } = req.body;
        const updatedProduct = {
            name,
            description,
            price,
            category, // Đảm bảo giá trị category là ObjectId hợp lệ
            stock,
            imageUrl
        };
        const result = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true }); // Cập nhật sản phẩm và trả về đối tượng đã cập nhật
        if (!result) {
            return res.status(404).send('Product not found');
        }
        res.redirect('/product'); // Điều hướng về trang danh sách sản phẩm hoặc trang khác sau khi cập nhật thành công
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

  

// Route để xóa sản phẩm
router.post('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/product');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;