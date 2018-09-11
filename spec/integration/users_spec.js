const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : users", () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });
  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });
  describe("POST /users/sign_up", () => {
    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: `${base}sign_up`,
        form: {
          name: "Number One",
          email: "user@example.com",
          password: "123456789",
          passwordConfirmation: "123456789"
        }
      }
      request.post(options, (err, res, body) => {
        User.findOne({ where: {email: "user@example.com"} })
        .then((user) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("user@example.com");
          expect(user.id).toBe(1);
          expect(user.role).toBe(0);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
    it("should not create a new user with invalid attributes and redirect", (done) => {
      const options = {
        url: `${base}sign_up`,
        form: {
          name: "No",
          email: "no",
          password: "123456789",
          passwordConfirmation: "123456789"
        }
      };
      request.post(options, (err, res, body) => {
        User.findOne({ where: {email: "no"} })
        .then((user) => {
          expect(user).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });
  describe("GET /users/:id", () => {
    
    beforeEach((done) => {

      request.get({ // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );

      this.user;
      this.wiki;

      User.create({
        name: "Mister Guy",
        email: "mrguy@tesla.com",
        password: "Trekkie4lyfe",
        passwordConfirmation: "Trekkie4lyfe",
        // role: 0
        // role: 1
        // role: 2
        role: 3
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Snowball Fighting",
          body: "So much snow!",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });

        request.get({ // mock authentication
          url: "http://localhost:3000/auth/fake",
          form: {
            userId: user.id,
            role: user.role,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
      });
    });

    it("should present a list of wikis a user has created", (done) => {
      request.get(`${base}${this.user.id}`, (err, res, body) => {
        console.log
        // expect(body).toContain("Standard");    // role: 0
        // expect(body).toContain("Premium");     // role: 1
        // expect(body).toContain("Admin");       // role: 2
        expect(body).toContain("huh?");        // role: 3
        expect(body).toContain("Snowball Fighting");
        done();
      });
    });
  });
});