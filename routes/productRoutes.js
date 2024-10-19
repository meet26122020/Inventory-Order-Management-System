const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  checkStock,
  getProducts,
  getProductById,
} = require('../controller/productController');
const { authenticate, IsAdmin } = require('../middleware/authenticate ');
const upload = require("../util/fileUpload");
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Server error
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A product object
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               description:
 *                 type: string
 *                 description: A description of the product
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The product image
 *               stock:
 *                 type: integer
 *                 description: The stock level of the product
 *               category:
 *                 type: string
 *                 description: The category of the product
 *     security:
 *       - bearerAuth: []  # Specify authentication
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/add', upload.single("image"), authenticate, IsAdmin, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *     security:
 *       - bearerAuth: []  # Specify authentication
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', upload.single("image"), authenticate, IsAdmin, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Specify authentication
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, IsAdmin, deleteProduct);

/**
 * @swagger
 * /products/inventory/low-stock:
 *   get:
 *     summary: Check for low stock products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []  # Specify authentication
 *     responses:
 *       200:
 *         description: A list of low-stock products
 *       500:
 *         description: Server error
 */
router.get('/inventory/low-stock', authenticate, IsAdmin, checkStock);

module.exports = router;
