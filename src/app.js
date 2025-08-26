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

// routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// for testing
app.get('/api/health', (req, res) => res.json({ ok: true }));

// init db
(async () => {
  await sequelize.sync({ alter: true }); // dev only; replace with migrations in prod
})();

module.exports = app;
