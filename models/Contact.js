const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  //   productId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Product', // Tham chiếu đến schema sản phẩm (Product)
  //     required: true
  //   },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến schema người dùng (User)
    required: true
  },
  email: {
    type: String,
  },
  //   rating: {
  //     type: Number,
  //     required: true,
  //     min: 1,
  //     max: 5
  //   },
  comment: {
    type: String,
  },
  //   title: {
  //     type: String,
  //   },
  datePost: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Contact', contactSchema);

