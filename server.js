const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'web' directory
app.use(express.static(path.join(__dirname, 'web')));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Serve the quilt index page
app.get('/quilt', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'quilt-index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`ZIP Code Data Extractor app running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
});
