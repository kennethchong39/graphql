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

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String! 
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name) {
        return `Hello, ${args.name}!`;
      }

      return 'Hello!';
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
  },
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
