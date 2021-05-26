import styled from 'styled-components';

import Header from './header';

export default function Layout({ children }) {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 50px 80px;
`;
