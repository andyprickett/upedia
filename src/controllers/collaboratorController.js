const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
  create(req, res, next) {
    if(req.user) {
      collaboratorQueries.createCollaborator(req, (err, collaborator) => {
        if(err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  },
  destroy(req, res, next) {
    if(req.user) {
      collaboratorQueries.deleteCollaborator(req, (err, deletedRecordsCount) => {
        if(err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  }
}