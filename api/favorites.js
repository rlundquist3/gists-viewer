const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const _ = require('lodash');

const db = require('./db');

const port = 3003;
const PER_PAGE = 20;

const serializeFavorite = (favorite) => ({
  ...favorite,
  gistId: favorite.gist_id,
});

const typeDefs = gql`
  type FavoriteGist {
    id: ID!
    gistId: String!
    favorited: Boolean
  }

  extend type Query {
    getFavoritedGists(page: Int): [FavoriteGist]
  }
`;

const resolvers = {
  Query: {
    getFavoritedGists: async (_object, { page = 0 }, _context, _info) => {
      const queryText = `SELECT * FROM favorite_gists LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}`;

      const res = await db.query(queryText);

      console.log(res);

      return _.map(res.rows, serializeFavorite);
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

apolloServer.listen({ port }).then(({ url }) => {
  console.log(`Favorites API ready at ${url}`);
});
