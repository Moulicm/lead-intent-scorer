const express = require('express');
const router = express.Router();
const store = require('../storage/inMemory');
const { computeRuleScore } = require('../services/rules');
const { askIntent } = require('../services/aiClient');
const { Parser } = require('json2csv');

router.post('/', async (req, res) => {
  let offer = store.getOffer();
  if (req.body.offer) {
    offer = req.body.offer;
    store.setOffer(offer); // store it for later
  }

  if (!offer) return res.status(400).send({ error: 'Offer not set. POST /offer first.' });

  const leads = store.getLeads();
  if (!leads || leads.length === 0) return res.status(400).send({ error: 'No leads uploaded. POST /leads/upload first.' });

  const results = [];
  for (const lead of leads) {
    const ruleScore = computeRuleScore(lead, offer); // 0-50
    let ai = { intent: 'Low', explanation: 'no ai available' };
    try { ai = await askIntent(offer, lead); } 
    catch (err) { ai = { intent: 'Medium', explanation: 'AI failed; defaulting to Medium' }; }
    const aiPoints = ai.intent === 'High' ? 50 : ai.intent === 'Medium' ? 30 : 10;
    results.push({
      ...lead,
      intent: ai.intent,
      score: Math.min(100, ruleScore + aiPoints),
      reasoning: ai.explanation
    });
  }

  store.setResults(results);
  res.send({ resultsCount: results.length, results });
});

router.get('/results', (req, res) => {
  res.send(store.getResults() || []);
});

router.get('/export/csv', (req, res) => {
  const results = store.getResults() || [];
  const fields = ['name','role','company','industry','location','intent','score','reasoning'];
  try {
    const parser = new Parser({ fields });
    const csv = parser.parse(results);
    res.header('Content-Type', 'text/csv');
    res.attachment('scored_leads.csv');
    return res.send(csv);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

module.exports = router;
