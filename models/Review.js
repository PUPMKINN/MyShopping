const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Tham chiếu đến schema sản phẩm (Product)
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến schema người dùng (User)
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
  },
  title: {
    type: String,
  },
  datePost: {
    type: Date,
    default: Date.now(),
  },
  avatar: {
    type: [String],
    default: [],
    validate: {
        validator: function (value) {
            return value.every(url => typeof url === 'string' && url.trim().length > 0);
        },
        message: 'Invalid image URLs in the list'
    }
},
});

module.exports = mongoose.model('Review', reviewSchema);

