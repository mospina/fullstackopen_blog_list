const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/user");

router.get("/", async (request, response, next) => {
  try {
    const users = await User.find({});

    response.json(
      users.map(({ username, name, id }) => {
        return { username, name, id };
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    if (!password) {
      const error = new Error("Password is required");

      throw { ...error, name: "ValidationError" };
    }

    if (password.length < 3) {
      const error = new Error("Password must have at least 3 characters");

      throw { ...error, name: "ValidationError" };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, name, passwordHash });

    const result = await user.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
