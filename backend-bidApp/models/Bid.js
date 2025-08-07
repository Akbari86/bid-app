const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  bidAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bid', bidSchema);