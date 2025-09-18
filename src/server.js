require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const offerRouter = require('./routes/offer');
const leadsRouter = require('./routes/leads');
const scoreRouter = require('./routes/score');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/offer', offerRouter);
app.use('/leads', leadsRouter);
app.use('/score', scoreRouter);

app.get('/', (req, res) => res.send({ status: 'ok', version: '1.0' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = app;
