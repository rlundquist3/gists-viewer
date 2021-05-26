import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'urql';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { IconButton, TickIcon } from 'evergreen-ui';

const MarkFavorited = `
  mutation ($id: ID!) {
    markGistFavorited (id: $id)
  }
`;
const MarkUnfavorited = `
  mutation ($id: ID!) {
    markGistUnfavorited (id: $id)
  }
`;

/**
 * There's a bit of optimistic UI here to display the expected result of
 * the mutations. A more elegant solution, which could also help some of the
 * refetch/rerender clunkiness of the gist lists would be leveraging Urql's
 * Graphcache (https://formidable.com/open-source/urql/docs/graphcache/cache-updates/).
 * Didn't have time to get into that here as the setup is somewhat involved,
 * but it is a great tool!
 */
export default function Gist({ id, createdAt, description, favorited: initialFavorited, username, refetch }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [_markFavoritedResult, markFavorited] = useMutation(MarkFavorited);
  const [_markUnfavoritedResult, markUnfavorited] = useMutation(MarkUnfavorited);

  const handleMarkFavorited = () => {
    markFavorited({ id });
    setFavorited(true);

    if (refetch) {
      refetch();
    }
  };
  const handleMarkUnfavorited = () => {
    markUnfavorited({ id });
    setFavorited(false);

    if (refetch) {
      refetch();
    }
  };

  return (
    <Container>
      <div>
        <Link href={`/gist-detail/${id}`}>
          <H3>{description}</H3>
        </Link>
        <p>by: {username}</p>
        <p>{DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_FULL)}</p>
      </div>

      {favorited && (
        <IconButton icon={TickIcon} appearance='primary' intent='success' onClick={handleMarkUnfavorited} />
      )}
      {!favorited && <IconButton icon={TickIcon} intent='success' onClick={handleMarkFavorited} />}
    </Container>
  );
}

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const H3 = styled.h3`
  cursor: pointer;
`;
