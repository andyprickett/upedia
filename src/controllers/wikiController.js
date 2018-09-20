const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application");
const markdown = require( "markdown" ).markdown;

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
    const authorized = new Authorizer(req.user).new();
    if(authorized) {
      res.render("wikis/new", {markdown});
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        // private: false,
        userId: req.user.id
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err) {
          console.log(err)
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req, (err, wiki) => {
      if(err || wiki == null) {
        // console.log(err)
        if(err == 403) { // You may know the :id of this wiki, but you can't see it!
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wikis");
        } else if(wiki == null) { // No wiki, bruh.
          res.redirect(404, "/wikis");
        } else {
          console.log(err);
          req.flash("error", "Something went wrong."); // Just in case.
          res.redirect("/wikis");
        }
      } else {
        wiki.body = markdown.toHTML(wiki.body); // the magic!
        res.render("wikis/show", { wiki });
      }
    });
  },
  destroy(req, res, next) {
    // wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
      wikiQueries.deleteWiki(req, (err, deletedRecordsCount) => {
      if(err) {
        // res.redirect(err, `/wikis/${wiki.id}`)
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        req.flash("notice", "Wiki deleted.");
        res.redirect(303, "/wikis")
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/wikis");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if(authorized) {
          res.render("wikis/edit", { wiki });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },
  update(req, res, next) {
    // wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null) {
        if(err === 403) {
          res.redirect(err, `/wikis/${req.params.id}/edit`);
        } else {
          res.redirect(err, "/wikis");
        }
      } else {
        req.flash("notice", "Well, look at you go!");
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  }
}
