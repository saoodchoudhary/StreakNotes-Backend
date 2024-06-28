const express = require('express');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err)
);
const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

