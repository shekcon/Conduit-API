const router = require('express').Router();
const user = require('../../controllers/user');
const passport = require('passport');


router.use('/:username', user.attachUser);

// get information user
router.get('/:username', user.getUser);

router.use('/:username/follow', passport.authenticate('jwt', { session: false }))
router.post('/:username/follow', user.follow);
router.delete('/:username/follow', user.unfollow);

module.exports = router;