const express = require('express');
const multer = require('multer');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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

// configure multer

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/'); // uploads is the folder name    
    },
    filename: function(req, file, cb){
        cb(null,  Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage, limits : {fileSize: 100000000} });

app.post('/api/upload', upload.single('file'), (req, res)=>{
    console.log('file', req.file);
    if(req.file){
        res.json({url: '/uploads/' + req.file.filename});
    }else{
        res.send('file not uploaded');
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//end of multer configuration




//  Routes
const userRoutes = require('./routes/user');
const notesRoutes = require('./routes/notes');
const streakRoutes = require('./routes/streaks');
const { checkAndHandleBrokenStreaks } = require('./helpers/checkAndHandleBrokenStreaks');

app.use('/api/notes', notesRoutes);

app.use('/api/user', userRoutes);
app.use('/api/streaks', streakRoutes);

checkAndHandleBrokenStreaks();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

