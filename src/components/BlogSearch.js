import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import Search from './Search';
import Blogs from './Blogs';
import { Button, Input } from './shared/Form';
import { Link } from 'react-router-dom';

const SEARCH = gql`
  query Search($match: String) {
    blogs(order_by: { title: asc }, where: { title: { _ilike: $match } }) {
      id
      title
      body
    }
  }
`;

export default function BlogSearch() {
  const [inputVal, setInputVal] = useState('');
  const [search, { loading, error, data }] = useLazyQuery(SEARCH);
  return (
    <div>
      <Search
        inputVal={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onSubmit={() => {
          search({ variables: { match: `%${inputVal}%` } });
        }}
      />
      <Link to="/blog/new">New Blog Post</Link>
      <Blogs newBlogs={data ? data.blogs : null} />
    </div>
  );
}
