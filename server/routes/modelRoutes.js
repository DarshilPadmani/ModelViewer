const express = require('express');
const Model = require('../models/Model');

const router = express.Router();

// GET /api/models - fetch all models
router.get('/', async (req, res) => {
  try {
    const models = await Model.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (err) {
    console.error('Error fetching models', err);
    res.status(500).json({ message: 'Failed to fetch models' });
  }
});

// POST /api/models - create a new model
router.post('/', async (req, res) => {
  try {
    const { name, modelUrl } = req.body;
    if (!name || !modelUrl) {
      return res.status(400).json({ message: 'name and modelUrl are required' });
    }

    const model = new Model({ name, modelUrl });
    await model.save();
    res.status(201).json(model);
  } catch (err) {
    console.error('Error creating model', err);
    res.status(500).json({ message: 'Failed to create model' });
  }
});

module.exports = router;

