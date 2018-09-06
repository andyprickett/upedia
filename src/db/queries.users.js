const User = require("./models").User;
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
      errorReformatted = [{
        param: err.errors[0].path,
        msg: err.errors[0].message
      }]
      callback(errorReformatted);
    });
  }/*,
  getUser(id, callback) {
    let result = {};
    User.findById(id)
    .then((user) => {\q
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;

        Post.scope({ method: ["lastFiveFor", id]}).all()
        .then((posts) => {
          result["posts"] = posts;

          Comment.scope({method: ["lastFiveFor", id]}).all()
          .then((comments) => {
            result["comments"] = comments;
            
            callback(null, result);
          })
          .catch((err) => {
            callback(err);
          });
        });
      }
    });
  }
  */
}