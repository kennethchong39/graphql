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
const users = [
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

const posts = [
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

const comments = [
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
    post: '11',
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
        posts(query: String): [Post!]!
    }

    type Mutation {
      createUser(name: String!, email: String!, age: Int): User!
      createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
      createComment(text: String!, author: ID!, post: ID!): Comment!
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
      const emailTaken = users.some((user) => user.email === args.email);

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
        ...args,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found');
      }

      const post = {
        id: uuidv4(),
        ...args,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);
      const postExists = posts.some(
        (post) => post.id === args.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post');
      }

      const comment = {
        id: uuidv4(),
        ...args,
      };

      comments.push(comment);

      return comment;
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
