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
        username
      }
    }
  }
`;

export default function FavoritedGists() {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GetFavoritedGists,
  });

  /**
   * You'll notice that refetching, loading, and error messages
   * are the same for each of these queries. If that were realistic,
   * I'd create a shared component to handle all of this, but ideally
   * there would be context-specific error, empty, and loading states
   * for each component/query.
   */
  const refetch = () => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  };

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
          <Gist {...favorite.gist[0]} id={favorite.gistId} favorited refetch={refetch} />
        </li>
      ))}
    </UL>
  );
}

const UL = styled.ul`
  list-style-type: none;
`;
