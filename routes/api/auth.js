const router = require('express').Router();
const auth = require('../../controllers/auth');


// anonymous
router.post('/login', auth.login);
router.post('/register', auth.register);

module.exports = router;