const router = require('express').Router();
const { getAllPosts, singlePost, createPost, updatePost, deletePost } = require('../controllers/post.controller');
const { authenticate } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { ADMIN, EDITOR } = require('../config/roles');


router.get('/', authenticate, getAllPosts);
router.get('/:id', authenticate, singlePost);
router.post('/', authenticate, roleMiddleware([ADMIN, EDITOR]), createPost);
router.put('/:id', authenticate, roleMiddleware([ADMIN, EDITOR]), updatePost);
router.delete('/:id', authenticate, roleMiddleware([ADMIN, EDITOR]), deletePost);

module.exports = router;
