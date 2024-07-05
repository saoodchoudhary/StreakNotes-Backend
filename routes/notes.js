const router = require('express').Router();
const { handleSaveNote, handleNotesList, handleSendNotes } = require('../controller/notes');


router.post('/save-note', handleSaveNote);
router.post('/list', handleNotesList);

router.post('/send', handleSendNotes);


module.exports = router;