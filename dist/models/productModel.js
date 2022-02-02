"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const productSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0.0,
    required: true
  },
  countInStock: {
    type: Number,
    default: 0,
    required: true
  },
  rating: {
    type: Number,
    default: 0.0,
    required: true
  },
  numReviews: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: true
});

const Product = _mongoose.default.model('Product', productSchema);

var _default = Product;
exports.default = _default;