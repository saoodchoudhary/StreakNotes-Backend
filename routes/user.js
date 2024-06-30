const { handleRegisterUser, handleLoginUser } = require('../controller/user')

const router = require('express').Router()


router.post("/register", handleRegisterUser)

router.post("/login", handleLoginUser)


module.exports = router