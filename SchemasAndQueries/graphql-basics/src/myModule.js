// Names export = Has a name. Has as many as needed.
// Default export = Has no name. You can only have one.
// Default will have no name when imported in another file

const message = 'Some message from myModule.js';

const name = 'Ken';

const location = 'San Jose';

const getGreeting = (name) => {
  return `Welcome ${name}`;
};

export { message, name, getGreeting, location as default };
