import { useRouter } from 'next/router';

import Layout from '../components/core/layout';
import Results from '../components/results';

export default function UserGists() {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Layout>
      <h2>Gists for: {username}</h2>
      <Results searchStr={username} />
    </Layout>
  );
}
