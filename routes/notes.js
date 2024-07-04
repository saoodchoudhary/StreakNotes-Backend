const router = require('express').Router();
const { handleSaveNote } = require('../controller/notes');


router.post('/save-note', handleSaveNote);


module.exports = router;