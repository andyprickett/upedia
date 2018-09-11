const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt =bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      // console.log(err.errors)
      errorReformatted = [{  // make this fit our view messaging
        param: err.errors[0].path,
        msg: err.errors[0].message
      }]
      callback(errorReformatted);
    });
  },
  getUser(id, callback) {
    let result = {};
    User.findById(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;

        Wiki.scope({ method: ["userWikis", id]}).all()
        .then((wikis) => {
          result["wikis"] = wikis;

          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        });
      }
    });
  },
  getAllUsers(callback) {
    return User.all()
    .then((users) => {
      callback(null, users);
    })
    .catch((err) => {
      callback(err);
    });
  }
}