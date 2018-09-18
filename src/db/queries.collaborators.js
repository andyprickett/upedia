const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");


module.exports = {
  createCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.newCollaborator
      }
    })
    .then((user) => {
      if(!user) {
        return callback("User not found!");
      } else if(user.id === req.user.id) {
        return callback("You can't add yourself as a collaborator, silly!");
      }
      // already a collaborator?
      Collaborator.findOne({
        where: {
          userId: user.id,
          wikiId: req.params.wikiId
        }
      })
      .then((alreadyCollaborator) => {
        if(alreadyCollaborator) {
          return callback("That user is already a collaborator!")
        }
        // alright, let's go ahead now and make a collaborator
        return Collaborator.create({
          wikiId: req.params.wikiId,
          userId: user.id
        })
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          console.log(err)
          callback("Something went wrong.");
        });
      })
      .catch((err) => {
        console.log(err)
        callback("Something went wrong.");
      });    
    })
    .catch((err) => {
      console.log(err)
      callback("Something went wrong.");
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
        })
        .catch((err) => {
          console.log(err)
          callback("Something went wrong.");
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch((err) => {
      console.log(err)
      callback("Something went wrong.");
    });
  }
}