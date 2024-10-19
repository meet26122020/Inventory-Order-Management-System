const Product = require("../models/productModel");

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  const image = req?.file?.filename;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: "product image is required",
    });
  }

  const { name, price, description, stock, category } = req.body;
  try {
    const product = new Product({
      name,
      price,
      description,
      image,
      stock,
      category,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products (Public for customers)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single product by ID (Public for customers)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
  const { name, price, description, image, stock, category } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    // If product does not exist
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details if provided in request body
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;  // Update image if provided
    product.stock = stock !== undefined ? stock : product.stock;  // Handle stock update
    product.category = category || product.category;

    // Save the updated product
    await product.save();

    // Send a success response with the updated product
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
      // Find product by ID
      const product = await Product.findById(req.params.id);
  
      // If product doesn't exist, return 404
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Delete the product using deleteOne
      await product.deleteOne();
  
      // Send success message
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      // Log the error for debugging
      console.error("Error deleting product:", error);
  
      // Send more informative error message to the client
      res.status(500).json({ 
        message: "Server error", 
        error: error.message || "Something went wrong" // Expose error message if available
      });
    }
  };
  
  
// Check stock levels (Admin only)
exports.checkStock = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 5 } }); // Find low-stock products
    res.json({ message: "Low-stock products", products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
