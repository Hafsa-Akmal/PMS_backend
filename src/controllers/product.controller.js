const { Op } = require('sequelize');


const { Product, ProductImage, Category } = require('../models');
const { cloudinary } = require('../middleware/upload'); 

async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'products', 
        public_id: filename.split('.')[0], 
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer); 
  });
}


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: 'Missing fields' });
    }

  
    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      categoryId,
      ownerId: req.user.id,
    });

    const files = req.files || [];
    const images = [];

    
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, file.originalname);

      images.push({
        productId: product.id,
        url: result.secure_url,       
        providerPublicId: result.public_id, 
      });
    }

    if (images.length) await ProductImage.bulkCreate(images);


    const created = await Product.findByPk(product.id, {
      include: [Category, ProductImage],
    });

    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 4,
      sort = 'newest',
      category,
      priceMin,
      priceMax,
      search,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const where = {};

    if (category) where.categoryId = Number(category);

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price[Op.gte] = Number(priceMin);
      if (priceMax) where.price[Op.lte] = Number(priceMax);
    }

    if (search) {
      const like = { [Op.iLike]: `%${search}%` }; 
      where[Op.or] = [{ name: like }, { description: like }];
    }

    const order =
      sort === 'newest' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [Category, ProductImage],
      order,
      offset: (page - 1) * limit,
      limit,
    });

    res.json({
      data: rows,
      page,
      total: count,
      totalPages: Math.floor(count / limit),
      hasNext: page * limit < count,
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// get by id
exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [Category, ProductImage],
  });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

// update images
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [ProductImage],
    });
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, description, price, categoryId, stock } = req.body;
    await product.update({ name, description, price, categoryId, stock });

    const files = req.files || [];
    const images = [];

    for (const file of files) {
  
        const result = await uploadToCloudinary(file.buffer, file.originalname);
        images.push({
          productId: product.id,
          url: result.secure_url,
          providerPublicId: result.public_id,
        });
      
    }

    if (images.length) await ProductImage.bulkCreate(images);

    const updated = await Product.findByPk(product.id, {
      include: [Category, ProductImage],
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteProduct = async (req, res) => {
try {
const product = await Product.findByPk(req.params.id, { include:
[ProductImage] });
if (!product) return res.status(404).json({ message: 'Not found' });
if (product.ownerId !== req.user.id) return res.status(403).json({ message:
'Forbidden' });

if (product.ProductImages?.length) {
for (const img of product.ProductImages) {
if (img.providerPublicId) {
try { await require('../config/cloudinary').uploader.destroy(img.providerPublicId); } catch {}
}
}
}
await product.destroy();
res.json({ success: true });
} catch (e) {
res.status(500).json({ message: 'Server error' });
}
};