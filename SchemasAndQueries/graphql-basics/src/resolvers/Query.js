const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      const isTitleMatch = post.title
        .toLowerCase()
        .includes(args.query.toLowerCase());
      const isBodyMatch = post.body
        .toLowerCase()
        .includes(args.query.toLowerCase());

      return isTitleMatch || isBodyMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  greeting(parent, args, ctx, info) {
    if (args.name) {
      return `Hello, ${args.name}!`;
    }

    return 'Hello!';
  },
  add(parent, args, ctx, info) {
    if (args.numbers.length === 0) {
      return 0;
    }

    return args.numbers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
  },
  grades(parent, args, ctx, info) {
    return [99, 80, 93];
  },
  me() {
    return {
      id: '123',
      name: 'Mike',
      email: 'mike@example.com',
      age: 28,
    };
  },
  post() {
    return {
      id: '456',
      title: 'Scary Post',
      body: 'Best Post',
      published: true,
    };
  },
};

export { Query as default };
