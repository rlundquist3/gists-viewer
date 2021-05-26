import { useState } from 'react';
import styled from 'styled-components';
import { Button, TextInput } from 'evergreen-ui';

import Results from './results';
import FavoritedGists from './favorited-gists';

export default function Search() {
  const [searchStr, setSearchStr] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  const handleSearchChange = (event) => {
    setSearchStr(event.target.value);
  };

  const handleSubmit = () => {
    if (searchStr.length > 2) {
      setSubmittedSearch(searchStr);
    }
  };

  return (
    <div>
      <TextInput value={searchStr} onChange={handleSearchChange} />
      <Button onClick={handleSubmit}>Let's Go!</Button>

      {submittedSearch.length > 2 && <Results searchStr={submittedSearch} />}
      {submittedSearch.length <= 2 && <FavoritedGists />}
    </div>
  );
}
