const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Bid = require('../models/Bid');

router.post('/', async (req, res) => {
  try {
    const { itemId, userId, bidAmount } = req.body;
    console.log('POST /api/bids body:', req.body);

    if (!mongoose.isValidObjectId(itemId) || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid itemId or userId format' });
    }
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ error: 'Invalid bid amount' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const minBid = item.currentBid || item.startingBid;
    if (bidAmount <= minBid) {
      return res.status(400).json({ error: `Bid must be higher than $${minBid}` });
    }

    const today = new Date();
    const endDate = new Date(item.auctionEndDate);
    if (today > endDate) {
      return res.status(400).json({ error: 'Auction has ended' });
    }

    const bid = await Bid.create({
      itemId: new mongoose.Types.ObjectId(itemId),
      userId: new mongoose.Types.ObjectId(userId),
      bidAmount: parseFloat(bidAmount),
    });

    item.currentBid = parseFloat(bidAmount);
    item.bidsCount += 1;
    await item.save();

    res.status(201).json(bid);
  } catch (err) {
    console.error('POST /api/bids error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log('GET /api/bids userId:', userId);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }
    const bids = await Bid.find({ userId: new mongoose.Types.ObjectId(userId) });
    console.log('GET /api/bids response:', bids);
    res.json(bids);
  } catch (err) {
    console.error('GET /api/bids error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;