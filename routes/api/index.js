const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');


router.use('/auth', auth);
router.use('/users', user);

module.exports = router;