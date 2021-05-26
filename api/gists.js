const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const _ = require('lodash');

const gistsAPI = require('../gists');

const port = 3002;

const serializeGist = (gist) => ({
  ..._.pick(gist, ['id', 'description']),
  createdAt: gist.created_at,
});

const typeDefs = gql`
  type Gist {
    id: ID!
    createdAt: String
    description: String
  }

  extend type Query {
    getGist(id: ID!): Gist
    getGistsForUser(username: String!, page: Int): [Gist]
  }
`;

const resolvers = {
  Query: {
    getGist: async (_object, { id }, _context, _info) => {
      const res = await gistsAPI.getGistById(id);
      console.log({ res });
      return serializeGist(res);
    },
    getGistsForUser: async (_object, { username, page }, _context, _info) => {
      const res = await gistsAPI.getGistsForUser(username, page);
      console.log({ res });

      return _.map(res, serializeGist);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

apolloServer.listen({ port }).then(({ url }) => {
  console.log(`Gists API ready at ${url}`);
});