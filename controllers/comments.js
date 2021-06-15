const router = require("express").Router();
const Blog = require("../models/blog");

router.post("/", async (request, response, next) => {
  return response.status(501).json({ error: "Not implemented." });
});

module.exports = router;
