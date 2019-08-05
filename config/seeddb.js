const User = require('../models/Users');


const seedData = (username, email, pwd) => {
    console.log("🎉 Seeding data...")
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            console.log(err);
            process.exit(1)
        }
        if (!user) {
            const admin = new User({
                username: username,
                email: email
            });
            admin.hashPassword(pwd)
            admin.save()
                .then((user) => console.log("🎉 Data created"))
                .catch((error) => {
                    console.log(error);
                    process.exit(1);
                })
        }
        else
            console.log("🎉 Data already created");
    })
}

seedData("shekcon", "quangsang9773@gmail.com", "123456789")