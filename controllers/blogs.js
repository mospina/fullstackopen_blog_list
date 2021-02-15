const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user");

    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  const payload = request.body;

  try {
    const user = User.findById(payload.userId);
    const blog = new Blog({ ...payload, likes: 0, user: user._id });
    const result = await blog.save();

    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const currentBlog = await Blog.findById(id);
    const payload = request.body;
    const blog = payload.likes
      ? { ...payload }
      : { ...payload, likes: currentBlog.likes + 1 };

    const result = await Blog.findByIdAndUpdate(id, blog, { new: true });

    response.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    await Blog.findByIdAndRemove(id);

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
