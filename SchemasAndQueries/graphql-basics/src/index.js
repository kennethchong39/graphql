// import myCurrentLocation, { message, name, getGreeting } from './myModule';
// import addition, { subtract } from './math';

// console.log(message);
// console.log(name);
// console.log(myCurrentLocation);
// console.log(getGreeting('W'));

// console.log(addition(12, 12));
// console.log(subtract(12, 12));

import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// Scalar Types: String, Boolean, Int, Float, ID (store a single value);

// Demo user data
let users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

let posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: true,
    author: '2',
  },
];

let comments = [
  {
    id: '102',
    text: 'This worked well for me. Thanks!',
    author: '3',
    post: '10',
  },
  {
    id: '103',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '10',
  },
  {
    id: '104',
    text: 'This did no work.',
    author: '2',
    post: '11',
  },
  {
    id: '105',
    text: 'Nevermind. I got it to work.',
    author: '1',
    post: '12',
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        comments: [Comment!]!
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
    }

    type Mutation {
      createUser(data: CreateUserInput!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!): Comment!

      deleteUser(id: ID!): User!
      deletePost(id: ID!): Post!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String!,
      body: String!,
      published: Boolean!,
      author: ID!
    }

    input CreateCommentInput {
      text: String!,
      author: ID!,
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email Taken');
      }

      // const user = {
      //   id: uuidv4(),
      //   name: args.name,
      //   email: args.email,
      //   age: args.age,
      // };
      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }

      const deletedComment = comments.splice(commentIndex, 1);

      return deletedComment[0];
    },
  },
  Post: {
    // This relates to type Post -> author field where we get the author post
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    // This relates to type User -> posts where we get all the post for the user
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
  // hello() {
  //   return 'This is a query!';
  // },
  // name() {
  //   return 'Ken';
  // },
  // location() {
  //   return 'San Jose';
  // },
  // bio() {
  //   return 'HELLO EVERYONE!';
  // },

  // id() {
  //   return 'abc123';
  // },
  // name() {
  //   return 'Ken';
  // },
  // age() {
  //   return 23;
  // },
  // employed() {
  //   return true;
  // },
  // gpa() {
  //   return 3.8;
  // },
  // title() {
  //   return 'Movies';
  // },
  // price() {
  //   return 14.99;
  // },
  // releaseYear() {
  //   return null;
  // },
  // rating() {
  //   return null;
  // },
  // inStock() {
  //   return true;
  // },
};

const server = new GraphQLServer({
  //   typeDefs: typeDefs,
  //   resolvers: resolvers,
  typeDefs,
  resolvers,
  //   abv is the same as commented out as it is the same name
});

server.start(() => {
  console.log('The server is up!');
});
