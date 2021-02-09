const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs)) return 0;

  return blogs.reduce((acc, { likes }) => acc + likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) return null;

  if (blogs.length === 0) return null;

  return blogs.reduce((acc, blog) => {
    if (acc === undefined) blog;

    return blog.likes > acc.likes ? blog : acc;
  });
};

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs)) return null;

  if (blogs.length === 0) return null;

  numberOfBlogsByAuthor = blogs.reduce((acc, { author }) => {
    if (acc.hasOwnProperty(author)) {
      return { ...acc, [author]: acc[author] + 1 };
    } else {
      return { ...acc, [author]: 1 };
    }
  }, {});

  return Object.entries(numberOfBlogsByAuthor).reduce(
    (acc, [author, blogs]) => {
      if (!acc) return { author, blogs };

      if (blogs > acc.blogs) {
        return { author, blogs };
      } else {
        return acc;
      }
    },
    null
  );
};

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs)) return null;

  if (blogs.length === 0) return null;

  numberOfLikesByAuthor = blogs.reduce((acc, { author, likes }) => {
    if (acc.hasOwnProperty(author)) {
      return { ...acc, [author]: acc[author] + likes };
    } else {
      return { ...acc, [author]: likes };
    }
  }, {});

  return Object.entries(numberOfLikesByAuthor).reduce(
    (acc, [author, likes]) => {
      if (!acc) return { author, likes };

      if (likes > acc.likes) {
        return { author, likes };
      } else {
        return acc;
      }
    },
    null
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
