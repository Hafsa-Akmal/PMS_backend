const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
return sequelize.define('ProductImage', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
productId: { type: DataTypes.INTEGER, allowNull: false },
url: { type: DataTypes.STRING, allowNull: false },
providerPublicId: { type: DataTypes.STRING }, // for cloudinary deletes
}, { tableName: 'product_images' });
};