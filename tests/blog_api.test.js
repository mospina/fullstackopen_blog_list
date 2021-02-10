const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
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
    url:
      "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url:
      "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  blogs = initialBlogs.map((blog) => {
    const newBlog = new Blog(blog);
    return newBlog.save();
  });
  await Promise.all(blogs);
});

describe("get /api/blogs", () => {
  test("return blogs in JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("return correct number of blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(6);
  });

  test("return blogs have an id field", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("post /api/blogs", () => {
  const newBlog = {
    title: "How to Deploy and Manage MongoDB with Docker",
    author: "Vladimir Kaplarevic",
    url: "https://phoenixnap.com/kb/docker-mongodb",
  };

  test("return added blog in JSON format", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("set likes to 1", async () => {
    const response = await api.post("/api/blogs").send(newBlog);

    expect(response.body.likes).toBe(0);
  });

  test("number of blogs increases", async () => {
    const response = await api.post("/api/blogs").send(newBlog);

    const blogs = await Blog.find({});
    expect(blogs).toHaveLength(7);
  });

  test("return 400 if author is missing", async () => {
    const invalidBlog = { ...newBlog };
    delete invalidBlog.author;

    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("return 400 if url is missing", async () => {
    const invalidBlog = { ...newBlog };
    delete invalidBlog.url;

    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => mongoose.connection.close());
