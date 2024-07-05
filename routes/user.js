const { handleRegisterUser, handleLoginUser, handleGetProfile, handleGetSuggestionsUser, handlePostFollowUser, handleGetSendUserForNotes } = require('../controller/user')

const router = require('express').Router()


router.post("/register", handleRegisterUser)

router.post("/login", handleLoginUser)

router.get("/profile/:uid", handleGetProfile)

router.get("/getSuggestionsUser/:uid", handleGetSuggestionsUser)

router.post("/follow", handlePostFollowUser)
router.get("/getSendUserForNotes/:uid", handleGetSendUserForNotes)


module.exports = router