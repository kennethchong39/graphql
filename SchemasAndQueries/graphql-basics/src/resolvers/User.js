const User = {
  // This relates to type User -> posts where we get all the post for the user
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.author === parent.id;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => {
      return comment.author === parent.id;
    });
  },
};

export { User as default };
