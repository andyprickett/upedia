const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");


module.exports = {
  createCollaborator(req, callback) {
    return Collaborator.create({
      wikiId: req.params.wikiId,
      userId: req.body.userId
    })
    .then((collaborator) => {
      callback(null, collaborator);
    })
    .catch((err) => {
      callback(err);
    });
  },
  deleteCollaborator(req, callback) {
    const id = req.params.id;
    return Collaborator.findById(id)
    .then((collaborator) => {
      if(!collaborator) {
        return callback("Collaborator not found");
      }
      const authorized = new Authorizer(req.user, collaborator).destroy();
      if(authorized) {
        Collaborator.destroy({ where: { id }}) // <-- this syntax
        .then((deletedRecordsCount) => {   // <-- will actually return a value for this when there's more than one record affected
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
  }
}