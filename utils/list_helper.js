const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs)) return 0;

  return blogs.reduce((acc, { likes }) => acc + likes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
