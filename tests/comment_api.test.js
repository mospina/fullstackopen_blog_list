const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

const sampleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const blogWithComments = {
  _id: "5a422bc61b54a676234d17fc",
  title: "Type wars",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 2,
  comments: ["Good article"],
  __v: 0,
};

const initialBlogs = [...sampleBlogs, blogWithComments];

const user = {
  username: "root",
  name: "Root",
  password: "secret",
};

const createToken = async (user) => {
  const loginUser = await User.findOne({ username: user.username });
  const userForToken = {
    username: loginUser.username,
    id: loginUser._id,
  };

  return jwt.sign(userForToken, process.env.SECRET);
};

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    name: user.name,
    passwordHash,
  });

  const owner = await newUser.save();

  await Blog.deleteMany({});
  blogs = initialBlogs.map((blog) => {
    const newBlog = new Blog({ ...blog, user: owner.id });
    return newBlog.save();
  });
  await Promise.all(blogs);
});

describe.only("post /api/blogs/:id/comments", () => {
  const [targetBlog, ...others] = initialBlogs;
  const newComment = {
    content: "Good blog",
  };

  test("return blog with comment in JSON format", async () => {
    await api
      .post(`/api/blogs/${targetBlog._id}/comments`)
      .send(newComment)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("comments are appended to existing comments", async () => {
    await api
      .post(`/api/blogs/${blogWithComments._id}/comments`)
      .send(newComment)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blog = await Blog.findById(blogWithComments._id);
    expect(blog.comments.length).toEqual(2);
  });

  test("return 400 if content is missing", async () => {
    const invalidComment = {};

    await api
      .post(`/api/blogs/${targetBlog._id}/comments`)
      .send(invalidComment)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => mongoose.connection.close());
