const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const _ = require('lodash');

const gistsAPI = require('../gists');

const port = 3002;

const serializeGist = (gist) => ({
  ..._.pick(gist, ['id', 'description']),
  createdAt: gist.created_at,
  files: _.keys(gist.files),
  username: gist.owner.login,
});

/**
 * Since this API is fairly small, I've kept the resolvers
 * and type definitions together in this file. If the types
 * were to get much larger or the resolvers had more complicated
 * logic, they'd be better in their own files.
 */

const typeDefs = gql`
  type Gist @key(fields: "id") {
    id: ID!
    createdAt: String
    description: String
    files: [String]
    username: String
  }

  extend type Query {
    getGist(id: ID!): Gist
    getGistsForUser(username: String!, page: Int): [Gist]
  }
`;

const resolvers = {
  Gist: {
    /**
     * This is susceptible to the infamous N+1 problem.
     * Unfortunately, there isn't a great way to solve that
     * with the endpoints available in GitHub's API. If there
     * were a way, for example, to make a request and pass an
     * array of gist ids in the body, this could be resolved
     * using dataloader (https://www.npmjs.com/package/dataloader)
     * and something like dataloader-sort
     * (https://www.npmjs.com/package/dataloader-sort - this seems very outdated,
     * and I'm sure there are better alternatives, but it is what
     * I've used before successfully).
     *
     * Fortunately, this isn't terrible performance-wise given that
     * we're dealing with pages of 20, but does become a problem with
     * the rate limit.
     *
     * An alternative would be storing all of the relevant gist info
     * in our local DB, but then we would not guarantee up-to-date data
     * (probably not an issue here, but food for thought in other contexts).
     */
    __resolveReference: async ({ id }) => {
      try {
        const res = await gistsAPI.getGistById(id);

        return serializeGist(res);
      } catch (error) {
        console.error(error);
      }
    },
  },
  Query: {
    getGist: async (_object, { id }, _context, _info) => {
      try {
        const res = await gistsAPI.getGistById(id);

        return serializeGist(res);
      } catch (error) {
        console.error(error);
      }
    },
    getGistsForUser: async (_object, { username, page }, _context, _info) => {
      try {
        const res = await gistsAPI.getGistsForUser(username, page);

        return _.map(res, serializeGist);
      } catch (error) {
        console.error(error);
      }
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

apolloServer.listen({ port }).then(({ url }) => {
  console.log(`Gists API ready at ${url}`);
});
