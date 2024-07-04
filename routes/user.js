const { handleRegisterUser, handleLoginUser, handleGetProfile } = require('../controller/user')

const router = require('express').Router()


router.post("/register", handleRegisterUser)

router.post("/login", handleLoginUser)

router.get("/profile/:uid", handleGetProfile)


module.exports = router