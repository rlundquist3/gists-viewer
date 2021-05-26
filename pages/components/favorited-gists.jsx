import { useQuery } from 'urql';
import map from 'lodash/map';
import styled from 'styled-components';

import Gist from './gist';

const GetFavoritedGists = `
  query {
    getFavoritedGists {
      id
      gistId
      gist {
        createdAt
        description
      }
    }
  }
`;

export default function FavoritedGists() {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GetFavoritedGists,
  });

  if (fetching) {
    return <p>working on it...</p>;
  }
  if (error) {
    return <p>oops: {error.message}</p>;
  }

  return (
    <UL>
      {map(data.getFavoritedGists, (favorite) => (
        <li key={favorite.id}>
          <Gist {...favorite.gist[0]} id={favorite.gistId} favorited refetch={reexecuteQuery} />
        </li>
      ))}
    </UL>
  );
}

const UL = styled.ul`
  list-style-type: none;
`;
