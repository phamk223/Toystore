var express = require('express');
const Product = require('../models/Product'); 
const Category = require('../models/Category');
var router = express.Router();
const getRandomItems = (arr, count) => {
  const shuffled = arr.slice(0); // Copy array to avoid mutation
  let i = arr.length, temp, index;

  // While there remain elements to shuffle...
  while (i--) {
      // Pick a remaining element...
      index = Math.floor(Math.random() * (i + 1));

      // And swap it with the current element.
      temp = shuffled[i];
      shuffled[i] = shuffled[index];
      shuffled[index] = temp;
  }

  // Return the first `count` elements
  return shuffled.slice(0, count);
};

// GET home page with random products and categories
router.get('/', async function(req, res, next) {
  try {
      // Fetch all products and categories
      const products = await Product.find({});
      const categories = await Category.find({});

      // Define the number of random items you want
      const randomProductsCount = 6; // Adjust as needed
      const randomCategoriesCount = 3; // Adjust as needed

      // Get random products and categories
      const randomProducts = getRandomItems(products, randomProductsCount);
      const randomCategories = getRandomItems(categories, randomCategoriesCount);

      // Render the home page with random products and categories
      res.render('home', {
          layout: 'layouthome',
          randomProducts: randomProducts,
          randomCategories: randomCategories
      });
  } catch (err) {
      next(err); // Pass errors to error handler
  }
});
router.get('/allproduct', async (req, res) => {
  try {
    const products = await Product.find().populate('category'); // Sử dụng populate đúng cách
    console.log(products); // Kiểm tra dữ liệu
    res.render('allproduct', { products, layout:'layouthome' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Route để hiển thị danh sách loại sản phẩm
router.get('/allcategory', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('allcategory', { categories, layout:'layouthome' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/* GET Blog */
router.get('/blog', function(req, res, next) {
  res.render('blog', { layout:'layouthome' });
});

/* GET Contact */
router.get('/contact', function(req, res, next) {
  res.render('contact', { layout:'layouthome' });
});

// // Route để lấy một sản phẩm theo ID và hiển thị chi tiết
router.get('/productdetail/:id', async (req, res) => {
  try {
    // Lấy ID từ tham số URL
    const productId = req.params.id;
    
    // Tìm sản phẩm theo ID
    const product = await Product.findById(productId).populate('category');
    
    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Render view với layout và gửi dữ liệu sản phẩm
    res.render('productDetail', { 
      product, 
      layout: 'layouthome' // Chỉ định layout cho view
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route để lấy tất cả sản phẩm theo danh mục
router.get('/categorydetail/:categoryId', async (req, res) => {
  try {
    // Lấy ID danh mục từ tham số URL
    const categoryId = req.params.categoryId;

    // Tìm danh mục để xác thực
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    // Tìm tất cả sản phẩm thuộc danh mục
    const products = await Product.find({ category: categoryId });

    // Render view với layout 'layouthome' và gửi dữ liệu sản phẩm
    res.render('categorydetail', {
      products,
      category,
      layout: 'layouthome'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// // Route để tìm kiếm sản phẩm
// router.get('/search', async (req, res) => {
//   try {
//     // Lấy từ khóa tìm kiếm từ query string
//     const query = req.query.q;

//     // Tìm sản phẩm theo tên (hoặc phần của tên)
//     const products = await Product.find({
//       name: { $regex: query, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
//     });

//     // Render view và gửi dữ liệu sản phẩm
//     res.render('searchResults', { products, query, layout:'layouthome' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;

