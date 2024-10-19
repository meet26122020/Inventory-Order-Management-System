const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  price: { 
    type: Number, 
    required: true 
},
  description: { 
    type: String 
},
image: {
    type: String,
    required: true, // This field is required
},
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
},
  category: { 
    type: String, 
    required: true 
},
});

// Alert for low stock
productSchema.methods.isLowStock = function () {
  return this.stock < 5;  // Define threshold for low stock
};

module.exports = mongoose.model('Product', productSchema);
