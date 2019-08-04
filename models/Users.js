var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var sercetkey = require('./config').sercetkey;

var UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    bio: String,
    image: String,
    hash: String
}, { timestamps: true });


UserSchema.methods.hashPassword = function (pwd) {
    this.hash = bcryptjs.hashSync(pwd)
}

UserSchema.methods.verifyPassword = function (pwd) {
    return bcryptjs.compareSync(pwd, this.hash)
}

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, sercetkey, {
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

mongoose.model('User', UserSchema);