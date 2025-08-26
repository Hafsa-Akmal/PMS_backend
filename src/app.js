const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', 
           
}));

const { sequelize } = require('./models');


const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


(async () => {
  await sequelize.sync({ alter: true }); 
})();

module.exports = app;
