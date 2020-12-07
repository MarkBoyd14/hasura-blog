import React from 'react';
import styled from '@emotion/styled';
import { Input, Button } from './shared/Form';

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  > button {
    margin-left: 1rem;
  }
`;

export default function Search({ inputVal, onChange, onSubmit }) {
  return (
    <SearchForm>
      <Input value={inputVal} onChange={onChange} />
      <Button onClick={onSubmit}>Search</Button>
    </SearchForm>
  );
}
