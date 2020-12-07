import React from 'react';
import { useSubscription, gql } from '@apollo/client';
import { List, ListItem } from './shared/List';
import { Link } from 'react-router-dom';

const BLOG = gql`
  subscription Blog($id: uuid!) {
    blogs_by_pk(id: $id) {
      id
      title
      body
    }
  }
`;

const Blog = ({
  match: {
    params: { id },
  },
}) => {
  const { loading, error, data } = useSubscription(BLOG, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const { title, body } = data.blogs_by_pk;

  return (
    <div>
      <Link to={`/blog/update/${id}`}>Update</Link>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
};

export default Blog;
