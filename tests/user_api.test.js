const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({
    username: "root",
    name: "Root User",
    passwordHash,
  });

  await user.save();
});

describe("post /api/users", () => {
  const newUser = {
    name: "New User",
    username: "newuser",
    password: "secret",
  };

  test("return added user in JSON format", async () => {
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("doesn't return password or hashPassword", async () => {
    const response = await api.post("/api/users").send(newUser);

    expect(response.password).not.toBeDefined();
    expect(response.hashPassword).not.toBeDefined();
  });

  test("doesn't store password", async () => {
    const response = await api.post("/api/users").send(newUser);

    const users = await User.findById(response.id);
    expect(response.password).not.toBeDefined();
  });

  test("return 400 if username is missing", async () => {
    const invalidUser = { ...newUser };
    delete invalidUser.username;

    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("return 400 if password is missing", async () => {
    const invalidUser = { ...newUser };
    delete invalidUser.password;

    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("return 400 if username is not unique", async () => {
    const invalidUser = { ...newUser, username: "root" };

    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});
afterAll(() => mongoose.connection.close());
