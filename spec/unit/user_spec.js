const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("User", () => {

  beforeEach((done) => {
    this.user;
    this.user3;
    this.user4;
    this.wiki;

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        name: "Number One",
        email: "user1@example.com",
        password: "1234567890",
        passwordConfirmation: "1234567890"
      })
      .then((user) => {
        expect(user.name).toBe("Number One");
        expect(user.email).toBe("user1@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
    it("should NOT create a user with invalid email or password", (done) => {
      User.create({
        name: "Number Two",
        email: "It's-a me, Mario!",
        password: "1234567890",
        passwordConfirmation: "1234567890"
      })
      .then((user) => {
        // code in this block won't be evaluated
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error: Must be a valid email.");
        done();
      });
    });
    it("should not create a user with an email already taken", (done) => {
      User.create({
        name: "Number Three",
        email: "user3@example.com",
        password: "1234567890",
        passwordConfirmation: "1234567890"
      })
      .then((user) => {
        this.user3 = user;
        console.log('hello 3')
        User.create({
          name: "Number Four",
          email: "user3@example.com",
          password: "nana BATMAN!",
          passwordConfirmation: "nana BATMAN!"

        })
        .then((user) => {
          // code in this block will not be evaluated
          this.user4 = user;
          console.log('hello 4')
          console.log(this.user4)
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
  describe("#getWikis()", () => {
    it("should return the associated wikis", (done) => {
      User.create({
        name: "Number One",
        email: "user1@example.com",
        password: "1234567890",
        passwordConfirmation: "1234567890"
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

          user.getWikis()
          .then((associatedWikis) => {
            expect(associatedWikis[0].title).toBe("Expeditions to Alpha Centauri");
            expect(associatedWikis[0].userId).toBe(user.id);
            done();
          })
        })
      });
    });
  });
});