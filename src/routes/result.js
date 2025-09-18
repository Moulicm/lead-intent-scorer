const express = require('express');
const { Parser } = require('json2csv');

const router = express.Router();

let results = [];

router.get('/', (req, res) => {
  if (req.query.format === 'csv') {
    try {
      const fields = [
        'name',
        'role',
        'company',
        'industry',
        'location',
        'intent',
        'score',
        'reasoning',
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      res.header('Content-Type', 'text/csv');
      res.attachment('results.csv');
      return res.send(csv);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.json(results);
});

module.exports = router;
