import chai from "chai";
import chaiHttp from "chai-http";
import app from "../CS546-Final-Project/app.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("/deleteUser/657a4288a2c6e45878110010 route", () => {
  // Test GET request
  it("should return status 200 on GET /deleteUser/:id", (done) => {
    chai
      .request(app)
      .get("/deleteUser/657a4288a2c6e45878110010")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/register route", () => {
  // Test GET request
  it("should return status 200 on GET /register", (done) => {
    chai
      .request(app)
      .get("/register")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test POST request
  it("should register a new user on POST /register", (done) => {
    const newUser = {
      firstNameInput: "Test",
      lastNameInput: "testpassword",
      usernameInput: "test",
      sexInput: "male",
      contactEmailInput: "test20t@testmail.com",
      ageInput: 23,
      passwordInput: "Ashmii@123",
      confirmPasswordInput: "Ashmii@123",
      locationInput: {
        firstLine: "61 Hutton Street",
        lastLine: "Jersey City",
        country: "USA",
        city: "Jersey City",
        state: "NJ",
        zip: "07307",
      },

      // Add other required fields for registration
    };

    chai
      .request(app)
      .post("/register")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(200); // Assuming successful registration returns a 200 status
        // expect(res.body)
        //   .to.have.property("message")
        //   .to.equal("User registered successfully");
        // You can add more assertions based on the response structure

        // Optionally, you can store the user ID for further testing or cleanup
        // const userId = res.body.userId;

        done();
      });
  });

  // Test GET request
  it("should return status 200 on GET /login", (done) => {
    chai
      .request(app)
      .get("/login")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // Test POST request
  it("should login a new user on POST /login", (done) => {
    // this.timeout(5000);
    const newUser = {
      contactEmailInput: "test16t@testmail.com",
      passwordInput: "Ashmii@123",
      // Add other required fields for registration
    };

    chai
      .request(app)
      .post("/login")
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(200); // Assuming successful registration returns a 200 status
        // expect(res.body)
        //   .to.have.property("message")
        //   .to.equal("User registered successfully");
        // You can add more assertions based on the response structure

        // Optionally, you can store the user ID for further testing or cleanup
        // const userId = res.body.userId;

        done();
      });
  });
});

describe("/getAllUsers route", () => {
  it("Should return status 200 on GET /getAllUsers", (done) => {
    chai
      .request(app)
      .get("/getAllUsers")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/getUser/:id route", () => {
  // Test GET request
  it("should return status 200 on GET /getUser/:id", (done) => {
    chai
      .request(app)
      .get("/getUser/6576ae8a214c1de95b533fe4")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/getuserbyusernmae route", () => {
  it("should return status 200 on GET /getUser/:username", (done) => {
    chai
      .request(app)
      .get("/getByUserName/test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/deleteUser/:id route", () => {
  // Test GET request
  it("should return status 200 on GET /deleteUser/:id", (done) => {
    chai
      .request(app)
      .get("/deleteUser/:id")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe("/updateUser route", () => {
  // Test GET request
  it("should return status 200 on GET /updateUser", (done) => {
    chai
      .request(app)
      .get("/updateUser")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

// this.timeout(5000);
it("should register a new user on POST /updateUser route", (done) => {
  const updateUser = {
    firstNameInput: "Test1",
    lastNameInput: "testpassword123",
    usernameInput: "testing",
    sexInput: "male",
    contactEmailInput: "test14t@testmail.com",
    ageInput: 23,
    passwordInput: "Ashmii@123",
    confirmPasswordInput: "Ashmii@123",
    locationInput: {
      firstLine: "141 Hutton Street",
      lastLine: "Jersey City",
      country: "USA",
      city: "Jersey City",
      state: "NJ",
      zip: "07307",
    },

    // Add other required fields for registration
  };
  chai
    .request(app)
    .post("/updateUser")
    .send(updateUser)
    .end((err, res) => {
      expect(res).to.have.status(200); // Assuming successful registration returns a 200 status
      // expect(res.body)
      //   .to.have.property("message")
      //   .to.equal("User registered successfully");
      // You can add more assertions based on the response structure

      // Optionally, you can store the user ID for further testing or cleanup
      // const userId = res.body.userId;

      done();
    });
});
