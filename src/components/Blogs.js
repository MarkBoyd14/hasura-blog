import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { List, ListItem } from './shared/List';

const BLOGS = gql`
  {
    blogs {
      id
      title
      body
    }
  }
`;

export default function Blogs({ newBlogs }) {
  const { loading, error, data } = useQuery(BLOGS);

  const renderBlogs = (blogs) => {
    return data.blogs.map(({ id, title, body }) => (
      <ListItem key={id}>
        <Link to={`/blog/${id}`}>{title}</Link>
      </ListItem>
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <List>{renderBlogs(newBlogs || data.blogs)}</List>
    </div>
  );
}
