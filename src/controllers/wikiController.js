const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },
  new(req, res, next) {
    // const authorized = new Authorizer(req.user).new();
    // if(authorized) {
      res.render("wikis/new");
    // } else {
    //   req.flash("notice", "You are not authorized to do that.");
    //   res.redirect("/topics");
    // }
  },
  create(req, res, next) {
    // const authorized = new Authorizer(req.user).create();
    // if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        // private: false,
        userId: 1
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err) {
          console.log(err)
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    // } else {
    //   req.flash("notice", "You are not authorized to do that.");
    //   res.redirect("/topics");
    // }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/wikis");
      } else {
        res.render("wikis/show", { wiki });
      }
    });
  },
  destroy(req, res, next) {
    // postQueries.deletePost(req, (err, deletedRecordsCount) => {
    wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      if(err) {
        res.redirect(err, `/wikis/${wiki.id}`)
      } else {
        res.redirect(303, "/wikis")
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/wikis");
      } else {
        // const authorized = new Authorizer(req.user, topic).edit();
        // if(authorized) {
          res.render("wikis/edit", { wiki });
        // } else {
        //   req.flash("notice", "You are not authorized to do that.");
        //   res.redirect(`/topics/${req.params.id}`);
        // }
      }
    });
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  }
}
