const { sequelize } = require('../config/db');
const User = require('./user')(sequelize);
const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);
const ProductImage = require('./productImage')(sequelize);
// Associations
User.hasMany(Product, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
Product.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(ProductImage, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });
5
module.exports = { sequelize, User, Category, Product, ProductImage };