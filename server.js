const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const server = app.listen(port, () => {
  console.log(`Listening on port : ${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use by another process.`);
  } else {
    console.error('Server error:', error);
  }
});