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

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

// Scalar Types: String, Boolean, Int, Float, ID (store a single value);

// Resolvers
// const resolvers = {
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
// };

const server = new GraphQLServer({
  //   typeDefs: typeDefs,
  //   resolvers: resolvers,
  typeDefs: './src/schema.graphql', //schema
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
  //   abv is the same as commented out as it is the same name
  context: {
    db,
  },
});

server.start(() => {
  console.log('The server is up!');
});
