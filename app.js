const express = require('express');
const path = require('path');

const app = express();
const PORT = 5500;

// Route to serve the HTML file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});