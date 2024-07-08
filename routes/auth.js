const router = require('express').Router();
const { userRegister, userLogin, verifyEmail, resetPassword, updatePassword } = require('../controllers/auth.controller');


router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/verifyemail/:token', verifyEmail);
router.post('/reset/password', resetPassword);
router.post('/update/password', updatePassword);

module.exports = router;