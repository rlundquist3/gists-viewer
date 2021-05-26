import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import _ from 'lodash';

import Layout from '../components/core/layout';
import Gist from '../components/gist';

const GetGist = `
  query($id: ID!) {
    getGist(id: $id) {
      createdAt
      description
      files
      username
      favoriteGist {
        favorited
      }
    }
  }
`;

export default function GistDetail() {
  const router = useRouter();
  const { gistId } = router.query;

  const [{ data, fetching, error }, _reexecuteQuery] = useQuery({
    query: GetGist,
    variables: { id: gistId },
  });

  if (fetching) {
    return <p>working on it...</p>;
  }
  if (error) {
    return <p>oops: {error.message}</p>;
  }

  const { favoriteGist, files } = data.getGist;

  return (
    <Layout>
      <Gist
        id={gistId}
        {..._.pick(data.getGist, ['createdAt', 'description', 'username'])}
        favorited={favoriteGist?.favorited}
      />
      <h4>Files:</h4>
      <ul>
        {_.map(files, (filename) => (
          <li>{filename}</li>
        ))}
      </ul>
    </Layout>
  );
}
