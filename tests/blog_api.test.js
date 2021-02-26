const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

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
    const token = await createToken(user);
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("set likes to 1", async () => {
    const token = await createToken(user);
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.likes).toBe(0);
  });

  test("number of blogs increases", async () => {
    const token = await createToken(user);
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);

    const blogs = await Blog.find({});
    expect(blogs).toHaveLength(7);
  });

  test("set current user to the new blog", async () => {
    const token = await createToken(user);
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.user).toBeDefined();
  });

  test("return 400 if author is missing", async () => {
    const invalidBlog = { ...newBlog };
    delete invalidBlog.author;
    const token = await createToken(user);

    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("return 400 if url is missing", async () => {
    const invalidBlog = { ...newBlog };
    delete invalidBlog.url;
    const token = await createToken(user);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("return 401 if token is missing", async () => {
    const invalidBlog = { ...newBlog };
    delete invalidBlog.url;

    await api
      .post("/api/blogs")
      .send(invalidBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("delete /api/blogs/:id", () => {
  const subject = initialBlogs[Math.floor(Math.random() * initialBlogs.length)];

  test("delete blog with given id", async () => {
    const token = await createToken(user);
    await api
      .delete(`/api/blogs/${subject._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  test("number of blogs decreases", async () => {
    const token = await createToken(user);
    const response = await api
      .delete(`/api/blogs/${subject._id}`)
      .set("Authorization", `Bearer ${token}`);

    const blogs = await Blog.find({});
    expect(blogs).toHaveLength(5);
  });

  test("return 400 if id is invalid", async () => {
    const token = await createToken(user);
    await api
      .delete("/api/blogs/0")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("return 401 when token is missing", async () => {
    const token = await createToken(user);
    await api.delete("/api/blogs/0").expect(401);
  });
});

describe("put /api/blogs/:id", () => {
  const subject = initialBlogs[Math.floor(Math.random() * initialBlogs.length)];

  test("update blog with given id", async () => {
    await api
      .put(`/api/blogs/${subject._id}`)
      .send(subject)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("increases likes by one if not provided", async () => {
    const previousLikes = subject.likes;
    const updatedBlog = { ...subject };
    delete updatedBlog.likes;

    const response = await api
      .put(`/api/blogs/${subject._id}`)
      .send(updatedBlog);

    const blog = await Blog.findById(updatedBlog._id);
    expect(blog.likes).toBe(previousLikes + 1);
  });

  test("return 400 if id is invalid", async () => {
    await api.put("/api/blogs/0").expect(400);
  });
});

afterAll(() => mongoose.connection.close());
