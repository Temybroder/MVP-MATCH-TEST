const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema({
  amountAvailable: {
    type: Number
  },
  cost: {
    type: Number
  },
  productName: {
    type: String
  },
  sellerId: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;