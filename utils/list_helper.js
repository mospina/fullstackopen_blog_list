const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs)) return 0;

  return blogs.reduce((acc, { likes }) => acc + likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs)) return null;

  if (blogs.length === 0) return null;

  return blogs.reduce((acc, blog) => {
    if (acc === undefined) blog

    return blog.likes > acc.likes ? blog : acc
  });
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
