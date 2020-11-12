const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')

const checkAuth = require('../middleware/check-auth')


router.post('/signup', UsersController.users_sign_up)

router.post('/login', UsersController.users_log_in)

// Add endpoint for refreshing the accessToken
router.post('/token', checkAuth, UsersController.users_refresh_token)

router.post('/logout', UsersController.users_log_out)

router.delete('/:userId', checkAuth, UsersController.users_delete_token)

module.exports = router