const router = require('express').Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/product.controller');
router.get('/', ctrl.getProducts);
router.get('/:id', auth,ctrl.getProductById);
router.post('/', auth, upload.array('images', 5), ctrl.createProduct);
router.put('/:id', auth, upload.array('images', 5), ctrl.updateProduct);
router.delete('/:id', auth, ctrl.deleteProduct);

module.exports = router;