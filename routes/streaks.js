

const router = require('express').Router();const { handleGetStreakAndRestoreDates } = require('../controller/streaks');


router.post('/getStreakAndRestoreDates', handleGetStreakAndRestoreDates);


module.exports = router;