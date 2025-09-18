const express = require('express');
const router = express.Router();
const store = require('../storage/inMemory');

router.post('/', (req, res) => {
  const { name, value_props, ideal_use_cases } = req.body;
  if (!name || !Array.isArray(value_props) || !Array.isArray(ideal_use_cases)) {
    return res.status(400).send({ error: 'name, value_props (array), ideal_use_cases (array) required' });
  }
  store.setOffer({ name, value_props, ideal_use_cases });
  res.status(201).send({ message: 'Offer saved', offer: store.getOffer() });
});

router.get('/', (req, res) => {
  res.send({ offer: store.getOffer() || null });
});

module.exports = router;
