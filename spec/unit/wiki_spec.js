const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
  
  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "Star Man",
        email: "starman@tesla.com",
        password: "Trekkie4lyfe",
        passwordConfirmation: "Trekkie4lyfe"
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
    it("should create a wiki object with a title and body", (done) => {
      Wiki.create({
        title: "JS Frameworks",
        body: "There are a lot of them",
        // private: false,
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("JS Frameworks");
        expect(wiki.body).toBe("There are a lot of them");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
    it("should not create a topic with missing title or description", (done) => {
      Wiki.create({
        title: "Angular is Better than React"
      })
      .then((wiki) => {
        //this code block will not be evaluated
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        done();
      });
    });
  });
  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
  });
  describe("#setUser()", () => {
    it("should associate a wiki and a user together", (done) => {
      User.create({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "password",
        passwordConfirmation: "password"
      })
      .then((newUser) => {
        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser)
        .then((wiki) => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });
});