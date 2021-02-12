const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const initialUsers = [
  {
    username: "root",
    name: "Root",
    password: "secret",
  },
  {
    username: "user",
    name: "User One",
    password: "secret",
  },
];

beforeEach(async () => {
  await User.deleteMany({});

  users = initialUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    });

    return newUser.save();
  });
  await Promise.all(users);
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

  test("return 400 if password is less than 3 characters", async () => {
    const invalidUser = { ...newUser, password: "nn" };

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

  test("return 400 if username has less than 3 characters", async () => {
    const invalidUser = { ...newUser, username: "nn" };

    await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("get /api/users", () => {
  test("return users in JSON format", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("return correct number of users", async () => {
    const response = await api.get("/api/users");

    expect(response.body).toHaveLength(2);
  });

  test("does not return passwordHash", async () => {
    const response = await api.get("/api/users");

    expect(response.body[0].passwordHash).not.toBeDefined();
  });
});
afterAll(() => mongoose.connection.close());
