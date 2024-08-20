const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Route để hiển thị danh sách loại sản phẩm
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('Category', { categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route để hiển thị form tạo loại sản phẩm mới
router.get('/create', (req, res) => {
  res.render('Category/create');
});

// Route để tạo loại sản phẩm mới
router.post('/create', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.redirect('/category');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route để hiển thị chi tiết loại sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.render('category', { category });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route để hiển thị form chỉnh sửa loại sản phẩm
router.get('/edit/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.render('Category/edit', { category });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route để cập nhật loại sản phẩm
router.post('/edit/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.redirect(`/Category`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route để xóa loại sản phẩm
router.post('/delete/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.redirect('/Category');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
