const listHelper = require("../utils/list_helper");

const blogs = [
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

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("totalLikes", () => {
  test("returns 0 with an empty list", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test("returns likes of a blog with one blog list", () => {
    expect(listHelper.totalLikes([blogs[0]])).toBe(blogs[0].likes);
  });

  test("returns total of likes of all blogs", () => {
    expect(listHelper.totalLikes(blogs)).toBe(36);
  });

  test("returns 0 when passing a wrong type of argument", () => {});
  expect(listHelper.totalLikes("blogs")).toBe(0);
});

describe("favoriteBlog", () => {
  test("returns null with an empty list", () => {
    expect(listHelper.favoriteBlog([])).toBe(null);
  });

  test("returns the same blog with one blog list", () => {
    expect(listHelper.favoriteBlog([blogs[0]])).toEqual(blogs[0]);
  });

  test("returns blog with highest likes from all blogs", () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });

  test("returns null when passing a wrong type of argument", () => {});
  expect(listHelper.favoriteBlog("blogs")).toBe(null);
});

describe("mostBlogs", () => {
  test("returns null with an empty list", () => {
    expect(listHelper.mostBlogs([])).toBe(null);
  });

  test("returns an object with author and one with one blog list", () => {
    expect(listHelper.mostBlogs([blogs[0]])).toEqual({
      author: blogs[0].author,
      blogs: 1,
    });
  });

  test("returns an object with author and number of blogs from all blogs", () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("returns null when passing a wrong type of argument", () => {});
  expect(listHelper.mostBlogs("blogs")).toBe(null);
});

describe("mostLikes", () => {
  test("returns null with an empty list", () => {
    expect(listHelper.mostLikes([])).toBe(null);
  });

  test("returns an object with author and likes with one blog list", () => {
    expect(listHelper.mostLikes([blogs[0]])).toEqual({
      author: blogs[0].author,
      likes: blogs[0].likes,
    });
  });

  test("returns an object with author and likes from all blogs", () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });

  test("returns null when passing a wrong type of argument", () => {});
  expect(listHelper.mostLikes("blogs")).toBe(null);
});
