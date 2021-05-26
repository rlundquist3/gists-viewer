import Head from 'next/head';
import styled from 'styled-components';

import Search from './components/search';

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Gists</title>
        <meta name='view and favorite gists' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Search />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
