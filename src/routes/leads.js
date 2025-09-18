const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const router = express.Router();
const store = require('../storage/inMemory');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send({ error: 'CSV file required as multipart/form-data field named "file"' });
  
  let records;
  try {
    records = parse(req.file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (err) {
    return res.status(400).send({ error: 'Invalid CSV', detail: err.message });
  }

  const leads = records.map(r => ({
    name: r.name || '',
    role: r.role || '',
    company: r.company || '',
    industry: r.industry || '',
    location: r.location || '',
    linkedin_bio: r.linkedin_bio || ''
  }));

  store.addLeads(leads);
  res.status(201).send({ message: `${leads.length} leads uploaded`, totalLeads: store.getLeads().length });
});

router.get('/', (req, res) => {
  res.send({ leads: store.getLeads() });
});

module.exports = router;
