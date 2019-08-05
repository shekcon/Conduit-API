var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var sercetkey = require('../config').sercetkey;

var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    bio: String,
    image: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hash: String
}, { timestamps: true });


UserSchema.plugin(uniqueValidator, { message: 'User is already taken.' });

UserSchema.methods.hashPassword = function (pwd) {
    this.hash = bcryptjs.hashSync(pwd)
}

UserSchema.methods.verifyPassword = function (pwd) {
    return bcryptjs.compareSync(pwd, this.hash)
}

UserSchema.methods.generateJWT = function () {
    return jwt.sign({
        id: this._id,
        username: this.username
    }, sercetkey,
        {
            expiresIn: '60d'
        });
}

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.toInfoJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image
    };
};

UserSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
        following: user ? user.isFollowing(this._id) : false
    };
};


UserSchema.methods.follow = function (id) {
    if (this.following.indexOf(id) === -1) {
        this.following.push(id);
    }

    return this.save();
};

UserSchema.methods.unfollow = function (id) {
    this.following.remove(id);
    return this.save();
};

module.exports = mongoose.model('User', UserSchema);