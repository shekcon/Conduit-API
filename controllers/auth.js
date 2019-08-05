const passport = require('passport');
const User = require('../models/Users');

function login(req, res) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            return res.json(user.toAuthJSON());
        });
    })(req, res);
}

function register(req, res) {
    const { username, password, email, bio, image } = req.body;
    const user = new User({
        username: username,
        email: email,
        bio: bio,
        image: image
    })
    user.hashPassword(password);
    user.save()
        .then((user) => {
            console.log(user);
            return res.send(user.toInfoJSON())
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send({
                message: err
            })
        });
}


function authorize(req, res, next) {
    if (req.user.username != req.params.username) {
        return res.sendStatus(403);
    }
    next()
}


module.exports = {
    login,
    register,
    authorize
}