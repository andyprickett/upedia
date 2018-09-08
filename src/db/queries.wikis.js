const Wiki = require("./models").Wiki;

module.exports = {
  getAllWikis(callback) {
    return Wiki.all()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },
  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      // private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getWiki(id, callback) {
    return Wiki.findById(id)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    });
  },
  // deleteWiki(req, callback) {
  deleteWiki(id, callback) {
    // return Wiki.findById(req.params.id)

    // .then((post) => {
      // const authorized = new Authorizer(req.user, post).destroy();
      
      // if(authorized) {
    return Wiki.destroy({
      where: {id}
    })
        // post.destroy()
    .then((wiki) => {
      callback(null, wiki);
        // });
      // } else {
      //   req.flash("notice", "You are not authorized to do that. I could hide the buttons from you in the view, or you could just sign in.");
      //   callback(401, null);
      // }
    })
    .catch((err) => {
      callback(err);
    });
  },
  // updateWiki(req, updatedWiki, callback) {
  updateWiki(id, updatedWiki, callback) {
    // return Wiki.findById(req.params.id)
    return Wiki.findById(id)
    .then((wiki) => {
      if(!wiki) {
        return callback(404);
      }
      // const authorized = new Authorizer(req.user, post).update();
      
      // if(authorized) {

        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
      //   });
      // } else {
      //   req.flash("notice", "You are not authorized to do that.");
      //   callback(403);
      // }
        })
        .catch((err) => {
          callback(err);
       });
    });
  }
}