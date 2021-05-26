import { useState } from 'react';
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

export default function Gist({ id, createdAt, description, favorited: initialFavorited, refetch }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [_markFavoritedResult, markFavorited] = useMutation(MarkFavorited);
  const [_markUnfavoritedResult, markUnfavorited] = useMutation(MarkUnfavorited);

  const handleMarkFavorited = () => {
    markFavorited({ id });
    setFavorited(true);
    refetch();
  };
  const handleMarkUnfavorited = () => {
    markUnfavorited({ id });
    setFavorited(false);
    refetch();
  };

  return (
    <Container>
      <div>
        <h3>{description}</h3>
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
