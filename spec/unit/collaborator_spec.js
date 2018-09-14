const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("Collaborator", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;
    this.user2;
    this.collaborator;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "Star Man",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        // passwordConfirmation: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          // private: false,
          userId: user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
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

  describe("#create()", () => {
    it("should create a collaborator for a wiki", (done) => {
      User.create({
        name: "Collaborator",
        email: "collab@example.com",
        password: "123456",
        // passwordConfirmation: "1234567890"
      })
      .then((user) => {
        this.user2 = user;
        expect(user.name).toBe("Collaborator");
        expect(user.email).toBe("collab@example.com");
        expect(user.id).toBe(2);
        // done();
     
        Collaborator.create({
          wikiId: this.wiki.id,
          userId: this.user.id
        })
        .then((collaborator) => {
          // console.log(collaborator);

          expect(collaborator.wikiId).toBe(this.wiki.id);
          expect(collaborator.userId).toBe(this.user.id);
          // done();
        
          Collaborator.create({
            wikiId: this.wiki.id,
            userId: this.user2.id
          })
          .then((collaborator) => {
            // console.log(collaborator);

            expect(collaborator.wikiId).toBe(this.wiki.id);
            expect(collaborator.userId).toBe(this.user2.id);
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
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
    it("should not create a collaborator without an assigned wiki or user", (done) => {
      Collaborator.create({
        userId: null
      })
      .then((collaborator) => {
        // code won't be evaluated
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Collaborator.userId cannot be null");
        expect(err.message).toContain("Collaborator.wikiId cannot be null");
        done();
      });
    });
  });
  describe("#setUser()", () => {
    it("should associate a collaborator and a user together", (done) => {
      Collaborator.create({
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        this.collaborator = collaborator;
        expect(collaborator.userId).toBe(this.user.id);

        User.create({
          name: "Bob Example",
          email: "bob@example.com",
          password: "password"
        })
        .then((user) => {
          this.collaborator.setUser(user)

          .then((collaborator) => {
            expect(collaborator.userId).toBe(user.id);
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
      }) 
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        collaborator.getUser()
        .then((user) => {
          expect(user.id).toBe(this.user.id);
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
  describe("setWiki()", () => {
    it("should associate a wiki and a collaborator together", (done) => {
      Collaborator.create({
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        this.collaborator = collaborator;

        Wiki.create({
          title: "Dress code on Proxima b",
          body: "Spacesuit, space helmet, space boots, and space gloves",
          userId: this.user.id
        })
        .then((newWiki) => {
          expect(this.collaborator.wikiId).toBe(this.wiki.id);

          this.collaborator.setWiki(newWiki)
          .then((collaborator) => {
            expect(collaborator.wikiId).toBe(newWiki.id);
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
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  describe("#getWiki()", () => {
    it("should return the associated wiki", (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((collaborator) => {
        collaborator.getWiki()
        .then((associatedWiki) => {
          expect(associatedWiki.title).toBe("Expeditions to Alpha Centauri");
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
});