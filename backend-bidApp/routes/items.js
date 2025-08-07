const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/new', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /api/items/new body:', req.body);
    console.log('POST /api/items/new file:', req.file);
    const { title, category, startingBid, auctionEndDate, userId } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    const itemData = {
      title,
      category,
      startingBid: parseFloat(startingBid),
      currentBid: parseFloat(startingBid),
      bidsCount: 0,
      auctionEndDate,
      userId: new mongoose.Types.ObjectId(userId),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
    };
    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (err) {
    console.error('POST /api/items/new error:', err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const itemIds = req.query.itemIds;
    console.log('GET /api/items userId:', userId, 'itemIds:', itemIds);
    let query = {};

    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }
      query = { userId: new mongoose.Types.ObjectId(userId) };
    } else if (itemIds) {
      const ids = itemIds.split(',').filter((id) => mongoose.isValidObjectId(id));
      if (ids.length === 0) {
        return res.status(400).json({ error: 'Invalid itemIds format' });
      }
      query = { _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } };
    }

    const items = await Item.find(query);
    console.log('GET /api/items response:', items);
    res.json(items);
  } catch (err) {
    console.error('GET /api/items error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;