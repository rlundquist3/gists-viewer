import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Button, IconButton, TickIcon } from 'evergreen-ui';

export default function Gist({ id, createdAt, description, favoriteGist }) {
  const markFavorited = () => {};
  const markUnfavorited = () => {};

  return (
    <Container>
      <div>
        <h3>{description}</h3>
        <p>{DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_FULL)}</p>
      </div>

      {favoriteGist?.favorited && (
        <IconButton icon={TickIcon} appearance='primary' intent='success' onClick={markUnfavorited} />
      )}
      {!favoriteGist?.favorited && <IconButton icon={TickIcon} intent='success' onClick={markFavorited} />}
    </Container>
  );
}

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
