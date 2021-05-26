const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const port = 3001;

const apolloGateway = new ApolloGateway({
  serviceList: [
    { name: 'gists', url: 'http://localhost:3002' },
    { name: 'favorites', url: 'http://localhost:3003' },
  ],
});

const apolloServer = new ApolloServer({
  gateway: apolloGateway,
  subscriptions: false,
});

apolloServer.listen({ port }).then(({ url }) => {
  console.log(`Gatweay API ready at ${url}`);
});
