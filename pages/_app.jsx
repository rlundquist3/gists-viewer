import { createClient, Provider } from 'urql';

import '../styles/globals.css';

const client = createClient({
  url: 'http://localhost:3001',
});

function GistsApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default GistsApp;
