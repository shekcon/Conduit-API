const User = require('../models/Users');

function getUser(req, res) {
    res.send(req.user.toProfileJSON());
}

function attachUser(req, res, next){
    User.findOne({ username: req.params.username }, function (err, user) {
        if (!user || err) return res.status(404);
        req.payload = user;
        next();
    })
}

function follow(req, res, next){
    const user = req.user;
    return user.follow(req.payload.id).then(() => res.send({
        message: `Following ${req.payload.username}`
    })).catch(next);
}

function unfollow(req, res, next){
    const user = req.user;
    return user.unfollow(req.payload.id).then(() => res.send({
        message: `Unfollow ${req.payload.username}`
    })).catch(next);
}

module.exports = {
    getUser,
    attachUser,
    follow,
    unfollow
}