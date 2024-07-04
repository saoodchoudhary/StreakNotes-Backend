const router = require('express').Router();
const { handleSaveNote, handleNotesList } = require('../controller/notes');


router.post('/save-note', handleSaveNote);
router.post('/list', handleNotesList);


module.exports = router;