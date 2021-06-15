const router = require("express").Router({ mergeParams: true });
const Blog = require("../models/blog");

router.post("/", async (request, response, next) => {
  try {
    const id = request.params.id;
    const { content } = request.body;
    const blog = await Blog.findById(id);

    if (!content) {
      return response.status(400).json({ error: "Content must be specified." });
    }

    blog.comments = blog.comments.concat(content);
    await blog.save();

    response.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
