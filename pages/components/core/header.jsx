import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const includeBackButton = router.pathname !== '/';

  return (
    <HeaderContainer>
      {includeBackButton && <StyledA onClick={() => router.back()}>← Back</StyledA>}
      <Link href='/'>
        <StyledA large>Favorites</StyledA>
      </Link>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  align-items: center;
  background-color: #7353b5;
  display: flex;
  justify-content: flex-start;
  height: 52px;
  padding: 0 40px;
`;

const StyledA = styled.a`
  color: #ededed;
  cursor: pointer;
  font-size: ${({ large }) => (large ? '22px' : '18px')};
  font-weight: ${({ large }) => (large ? 'bold' : 'normal')};
  margin-right: 24px;
`;
