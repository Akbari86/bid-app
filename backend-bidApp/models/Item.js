const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: null }, 
  bidsCount: { type: Number, default: 0 },
  auctionEndDate: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

module.exports = mongoose.model('Item', itemSchema);