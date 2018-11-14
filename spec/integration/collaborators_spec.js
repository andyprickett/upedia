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
    this.user2;
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

          User.create({
            name: "Mister Guy",
            email: "mrguy@tesla.com",
            password: "Trekkie4lyfe",
          })
          .then((user) => {
            this.user2 = user;
            done();
          // })
          // .catch((err) => {
          //   console.log(err);
          //   done();
          });
        // })
        // .catch((err) => {
        //   console.log(err);
        //   done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  // premium user contex
  describe("singed in user added as a collaborator", () => {

    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 1,
          email: this.user.email,
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("POST /wikis/:wikiId/collaborators/create", () => {

      it("should create a collaborator with other user object", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/collaborators/create`,
          form: {
            userId: this.user2.id,
            newCollaborator: this.user2.email
          }
        };
        request.post(options, (err, res, body) => {
          Collaborator.findOne({
            where: {
              // userId: this.user.id,
              wikiId: this.wiki.id
            }
          })
          .then((collaborator) => {
            // console.log(collaborator)
            expect(collaborator).not.toBeNull();
            expect(collaborator.userId).toBe(this.user2.id);
            expect(collaborator.wikiId).toBe(this.wiki.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
    describe("POST /wikis/:wikiId/collaborators/:id/destroy", () => {
      it("should destroy a collaborator object", (done) => {
        const options1 = {
          url: `${base}${this.wiki.id}/collaborators/create`,
          form: {
            userId: this.user2.id,
            newCollaborator: this.user2.email
          }
        };
        let collabCountBeforeDelete;

        request.post(options1, (err, res, body) => {
          this.wiki.getCollaborators()
          .then((beforeCollaborators) => {
            collabCountBeforeDelete = beforeCollaborators.length;
            const collaborator = beforeCollaborators[0];

            const options2 = {
              url: `${base}${this.wiki.id}/collaborators/${collaborator.id}/destroy`
            };
            request.post(options2, (err, res, body) => {
              this.wiki.getCollaborators()
              .then((afterCollaborators) => {
                expect(afterCollaborators.length).toBe(collabCountBeforeDelete - 1);
                done();
              })
              .catch((err) => {
                console.log(err);
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