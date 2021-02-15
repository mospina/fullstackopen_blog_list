const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/user");

router.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs");

    response.json(users.map(removePasswordHash));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    if (!password) {
      const error = new Error("Password is required");

      throw {
        ...error,
        name: "ValidationError",
        message: "Password is required",
      };
    }

    if (password.length < 3) {
      const error = new Error("Password must have at least 3 characters");

      throw {
        ...error,
        name: "ValidationError",
        message: "Password must have at least 3 characters",
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, name, passwordHash });

    const result = await user.save();

    response.status(201).json(removePasswordHash(result));
  } catch (error) {
    next(error);
  }
});

const removePasswordHash = ({ username, name, id }) => {
  if (!username || !name || !id) {
    const error = new Error("Invalid user data");

    throw {
      ...error,
      name: "TypeError",
      message: "Invalid user data",
    };
  }

  return { username, name, id };
};
module.exports = router;
