const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});

    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  const blog = new Blog({ ...request.body, likes: 0 });

  try {
    const result = await blog.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
