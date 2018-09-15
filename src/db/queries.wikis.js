const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");

module.exports = {
  getAllWikis(callback) {
    return Wiki.all({
      where: {
        private: false
      }
    })
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
    return Wiki.findById(id, {
      include: [{ model: Collaborator, as: "collaborators", include: [{ model: User }] }]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deleteWiki(req, callback) {
  // deleteWiki(id, callback) {
    return Wiki.findById(req.params.id)

    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      
      if(authorized) {
    // return Wiki.destroy({
    //   where: {id}
    // })
        wiki.destroy()
        // .then((wiki) => {
        .then((deletedRecordsCount) => {
      // callback(null, wiki);
          callback(null, deletedRecordsCount);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  // updateWiki(id, updatedWiki, callback) {
  updateWiki(req, updatedWiki, callback) {
    // return Wiki.findById(id)
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki) {
        return callback(404);
      }
      const authorized = new Authorizer(req.user, wiki).update();
      
      if(authorized) {

        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(403);
      }
    })
    .catch((err) => {
      callback(err);
    });
  }
}