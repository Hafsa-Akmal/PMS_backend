const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize) => {
const User = sequelize.define('User', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
name: { type: DataTypes.STRING, allowNull: false },
email: { type: DataTypes.STRING, allowNull: false, unique: true },
passwordHash: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'users' });
User.beforeCreate(async (user) => {
if (user.passwordHash && !user.passwordHash.startsWith('$2b$')) {
user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
}
});
return User;
};