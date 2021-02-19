const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const user = {
  username: "root",
  name: "Root",
  password: "secret",
};

const anotherUser = {
  username: "user",
  name: "User One",
  password: "differentSecret",
};

const initialUsers = [user, anotherUser];

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

describe("post /api/login", () => {
  test("return response in JSON format", async () => {
    await api
      .post("/api/login")
      .send({ username: user.username, password: user.password })
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("return token", async () => {
    const response = await api
      .post("/api/login")
      .send({ username: user.username, password: user.password });

    expect(response.body.token).not.toBeUndefined();
  });

  test("return 401 when password is incorrect", async () => {
    await api
      .post("/api/login")
      .send({ username: user.username, password: anotherUser.password })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});
afterAll(() => mongoose.connection.close());
