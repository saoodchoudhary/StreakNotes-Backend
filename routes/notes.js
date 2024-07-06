const router = require('express').Router();
const { handleSaveNote, handleNotesList, handleSendNotes, handleRecieveNotes } = require('../controller/notes');


router.post('/save-note', handleSaveNote);
router.post('/list', handleNotesList);

router.post('/send', handleSendNotes);

router.get("/recieved/:uid", handleRecieveNotes);


module.exports = router;