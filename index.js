const server = require('./server');
require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.send("Claude 3.5 Sonnet LLM API is running");
});




mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }).catch((error) => {

    console.log(process.env.MONGODB_URI);
    console.error('Error connecting to MongoDB:', error);
  });

