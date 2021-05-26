import { useState } from 'react';
import styled from 'styled-components';
import { Button, SearchInput } from 'evergreen-ui';
import { useRouter } from 'next/router';

import Results from './results';

export default function Search() {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState('');

  const handleSearchChange = (event) => {
    setSearchStr(event.target.value);
  };

  const handleSubmit = () => {
    router.push(`/user-gists/${searchStr}`);
  };

  return (
    <div>
      <SearchInput value={searchStr} onChange={handleSearchChange} marginRight='24px' />
      <Button onClick={handleSubmit} disabled={searchStr.length < 2}>
        Let's Go!
      </Button>
    </div>
  );
}
