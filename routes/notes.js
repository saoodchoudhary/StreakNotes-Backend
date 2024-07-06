const router = require('express').Router();
const { handleSaveNote, handleNotesList, handleSendNotes, handleRecieveNotes, handleFetchOneNotes } = require('../controller/notes');


router.post('/save-note', handleSaveNote);
router.post('/list', handleNotesList);

router.post('/send', handleSendNotes);

router.get("/recieved/:uid", handleRecieveNotes);

router.get("/fetchOneNotes/:noteId", handleFetchOneNotes);



module.exports = router;