var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = require('./Users');

var ArticleSchema = new mongoose.Schema({
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


ArticleSchema.plugin(uniqueValidator, { message: 'Article is already taken' });

ArticleSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }

    next();
});


ArticleSchema.methods.updateFavoriteCount = function () {
    var article = this;

    return User.count({ favorites: { $in: [article._id] } }).then(function (count) {
        article.favoritesCount = count;

        return article.save();
    });
};

ArticleSchema.methods.toInfoJSON = function (user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        tagList: this.tagList,
        favorited: user ? user.isFavorite(this._id) : false,
        favoritesCount: this.favoritesCount,
        author: this.author.toProfileJSON(user)
    };
};

module.exports = mongoose.model('Article', ArticleSchema);
