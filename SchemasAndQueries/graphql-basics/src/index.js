// import myCurrentLocation, { message, name, getGreeting } from './myModule';
// import addition, { subtract } from './math';

// console.log(message);
// console.log(name);
// console.log(myCurrentLocation);
// console.log(getGreeting('W'));

// console.log(addition(12, 12));
// console.log(subtract(12, 12));

import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID (store a single value);

// Demo user data
const users = [
  {
    id: '1',
    name: 'Ken',
    email: 'ken@example.com',
    age: 23,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'John',
    email: 'john@example.com',
  },
];

const posts = [
  {
    id: '4',
    title: 'Hello World',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nisi!',
    published: true,
    author: '1',
  },
  {
    id: '5',
    title: 'New Course',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nisi!',
    published: true,
    author: '1',
  },
  {
    id: '6',
    title: '101 Crash Course',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nisi!',
    published: true,
    author: '2',
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

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
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
