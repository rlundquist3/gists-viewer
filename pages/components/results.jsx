import { useQuery } from 'urql';
import map from 'lodash/map';
import styled from 'styled-components';

import Gist from './gist';

const GetGistsForUser = `
  query($username: String!, $page: Int) {
    getGistsForUser(username: $username, page: $page) {
      id
      createdAt
      description
      favoriteGist {
        favorited
      }
    }
  }
`;

export default function Results({ searchStr }) {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GetGistsForUser,
    variables: { username: searchStr, page: 0 },
  });

  if (fetching) {
    return <p>working on it...</p>;
  }
  if (error) {
    return <p>oops: {error.message}</p>;
  }

  return (
    <UL>
      {map(data.getGistsForUser, (gist) => (
        <li key={gist.id}>
          <Gist {...gist} favorited={gist.favoriteGist?.favorited} refetch={reexecuteQuery} />
        </li>
      ))}
    </UL>
  );
}

const UL = styled.ul`
  list-style-type: none;
`;
