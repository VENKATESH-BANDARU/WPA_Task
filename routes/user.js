const router = require('express').Router();
const { getAlluser, singleUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { ADMIN } = require('../config/roles');


router.get('/', authenticate, roleMiddleware([ADMIN]), getAlluser);
router.get('/:id', authenticate, roleMiddleware([ADMIN]), singleUser);
router.put('/:id', authenticate, roleMiddleware([ADMIN]), updateUser);
router.delete('/:id', authenticate, roleMiddleware([ADMIN]), deleteUser);

module.exports = router;
