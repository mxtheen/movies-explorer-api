const router = require('express').Router();

const { getCurrentUserData, updateUserData } = require('../controllers/users');

const { validationUpdateUserData } = require('../middlewares/celebrate/user');

router.get('/me', getCurrentUserData);
router.patch('/me', validationUpdateUserData, updateUserData);

module.exports = router;
