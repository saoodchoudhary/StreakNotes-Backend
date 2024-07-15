

const router = require('express').Router();const { handleGetStreakAndRestoreDates, handlePostRestoreStreaks } = require('../controller/streaks');


router.post('/getStreakAndRestoreDates', handleGetStreakAndRestoreDates);

router.post('/restore', handlePostRestoreStreaks);


module.exports = router;