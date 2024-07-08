const router = require('express').Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const postRoutes = require('./post');


router.use('/', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);

module.exports = router;