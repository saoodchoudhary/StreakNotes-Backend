const express = require('express');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err)
);

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);




// Routes
const userRoutes = require('./routes/user');

app.use('/api/user', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

