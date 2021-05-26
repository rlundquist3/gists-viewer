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
    favorited: Boolean
    gistId: String!
    gist: [Gist]
  }

  extend type Gist @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    getFavoritedGists(page: Int): [FavoriteGist]
  }

  extend type Mutation {
    markGistFavorited(id: ID!): Boolean
    markGistUnfavorited(id: ID!): Boolean
  }
`;

const resolvers = {
  FavoriteGist: {
    gist: (favoriteGist, _args, _context, _info) => {
      return [
        {
          __typename: 'Gist',
          id: favoriteGist.gistId,
        },
      ];
    },
  },
  Query: {
    getFavoritedGists: async (_object, { page = 0 }, _context, _info) => {
      const queryText = `SELECT * FROM favorite_gists WHERE favorited = true LIMIT ${PER_PAGE} OFFSET ${
        page * PER_PAGE
      }`;

      const res = await db.query(queryText);

      return _.map(res.rows, serializeFavorite);
    },
  },
  Mutation: {
    markGistFavorited: async (_object, { id }, _context, _info) => {
      const queryText = `INSERT INTO favorite_gists(gist_id, favorited) VALUES($1, $2) ON CONFLICT (gist_id) DO UPDATE SET favorited = true`;

      try {
        await db.query(queryText, [id, true]);

        return true;
      } catch (error) {
        console.error(error);

        return false;
      }
    },
    markGistUnfavorited: async (_object, { id }, _context, _info) => {
      const queryText = `INSERT INTO favorite_gists(gist_id, favorited) VALUES($1, $2) ON CONFLICT (gist_id) DO UPDATE SET favorited = false`;

      try {
        await db.query(queryText, [id, false]);

        return true;
      } catch (error) {
        console.error(error);

        return false;
      }
    },
  },
};

const apolloServer = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

apolloServer.listen({ port }).then(({ url }) => {
  console.log(`Favorites API ready at ${url}`);
});
