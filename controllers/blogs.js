const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    return authorization.substring(7);
  }
  return null;
};

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
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "Token missing or invalid" });
  }

  try {
    const user = User.findById(decodedToken.id);
    const blog = new Blog({ ...payload, likes: 0, user: user.id });
    const result = await blog.save();
    user.blogs.concat(result.id);
    await user.save();

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
