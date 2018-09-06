const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

  beforeEach((done) => {
    this.user3;
    this.user4;

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
        password: "1234567890"
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
        password: "1234567890"
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
        password: "1234567890"
      })
      .then((user) => {
        this.user3 = user;
        console.log('hello 3')
        User.create({
          name: "Number Four",
          email: "user3@example.com",
          password: "nana BATMAN!"
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
});