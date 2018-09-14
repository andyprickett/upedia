const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;
const Collaborator = require("../../src/db/models").Collaborator;

describe("routes : collaborators", () => {
  
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "Star Man",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          userId: user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          // this.post = this.wiki.posts[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
/*
  // guest user context
  describe("guest attempting to favorite a post", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
      it("should not create a new favorite", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`
        };
        let favCountBeforeCreate;
        this.post.getFavorites()
        .then((beforeFavorites) => {
          favCountBeforeCreate = beforeFavorites.length;
          request.post(options, (err, res, body) => {
            Favorite.all()
            .then((afterFavorites) => {
              expect(favCountBeforeCreate).toBe(afterFavorites.length);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
        });
      });
    });
  });
  */
  // signed in user contex
  describe("premium user creating a collaborator", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 1,
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /topics/:topicId/posts/:postId/favorites/create", () => {
      it("should create a favorite", (done) => {
        const options = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`
        };
        request.post(options, (err, res, body) => {
          Favorite.findOne({
            where: {
              userId: this.user.id,
              postId: this.post.id
            }
          })
          .then((favorite) => {
            expect(favorite).not.toBeNull();
            expect(favorite.userId).toBe(this.user.id);
            expect(favorite.postId).toBe(this.post.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
    describe("POST /topics/:topicId/posts/:postId/favorites/:id/destroy", () => {
      it("should destroy a favorite", (done) => {
        let options1 = {
          url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`
        };
        let favCountBeforeDelete;
        request.post(options1, (err, res, body) => {
          this.post.getFavorites()
          .then((beforeFavorites) => {
            favCountBeforeDelete = beforeFavorites.length;
            const favorite = beforeFavorites[0];

            let options2 = {
              url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/${favorite.id}/destroy`
            };
            request.post(options2, (err, res, body) => {
              this.post.getFavorites()
              .then((afterFavorites) => {
                expect(afterFavorites.length).toBe(favCountBeforeDelete - 1);
                done();
              });
            });
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });
});