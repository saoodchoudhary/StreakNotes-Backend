const { handleRegisterUser, handleLoginUser, handleGetProfile, handleGetSuggestionsUser, handlePostFollowUser, handleGetSendUserForNotes, handleGetSearchUser, handleGetSomeUser, handleGetFollowerFollowingUser, handleOtpSendtoUser, handleOtpRegisterUser, handleResendOtp } = require('../controller/user')

const router = require('express').Router()




router.post("/otp-register", handleOtpSendtoUser)

router.post("/verify-otp", handleOtpRegisterUser)
router.post("/resend-otp", handleResendOtp)

router.post("/login", handleLoginUser)

router.get("/profile/:uid", handleGetProfile)

router.get("/getSuggestionsUser/:uid", handleGetSuggestionsUser)

router.post("/follow", handlePostFollowUser)
router.get("/getSendUserForNotes/:uid", handleGetSendUserForNotes)

router.get("/search", handleGetSearchUser);

router.get("/someUser/:uid", handleGetSomeUser);

router.get("/follower-following/:uid", handleGetFollowerFollowingUser);


module.exports = router