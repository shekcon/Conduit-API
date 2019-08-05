const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const sercetkey = require('../config').sercetkey;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) return done(err);
        if (!user || !user.verifyPassword(password)) 
            return done(null, false, 'Email or password is invalid');
        return done(null, user);
    })
}));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: sercetkey,
    ignoreExpiration: false,
}, async function (payload, cb) {
    try {
        const user = await User.findById(payload.id);
        if (!user) cb("User isn't found");
        return cb(null, user);
    }
    catch (err) {
        return cb(err);
    }
}
));