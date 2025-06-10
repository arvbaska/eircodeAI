const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const dataPath = path.join(__dirname, 'data', 'eircodes.json');
let dataset = [];

// Load dataset once at startup
try {
  const file = fs.readFileSync(dataPath, 'utf8');
  dataset = JSON.parse(file);
} catch (err) {
  console.error('Failed to load dataset', err);
}

app.use(express.static(path.join(__dirname, 'public')));

// Search endpoint
app.get('/search', (req, res) => {
  const query = (req.query.q || '').toString().trim().toUpperCase();
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }
  // Try to match eircode exactly
  const match = dataset.find(item => item.eircode.toUpperCase() === query);
  if (match) {
    return res.json({ address: match.address });
  }
  // Otherwise search address substring
  const matchAddr = dataset.find(item => item.address.toUpperCase().includes(query));
  if (matchAddr) {
    return res.json({ address: matchAddr.address });
  }
  res.status(404).json({ error: 'Address not found' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
