import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { List, ListItem } from './shared/List';
import { Button } from './shared/Form';

const BLOGS = gql`
  {
    blogs {
      id
      title
      body
    }
  }
`;

const DELETE_BLOG = gql`
  mutation($id: uuid!) {
    delete_blogs_by_pk(id: $id) {
      id
      title
      body
    }
  }
`;

export default function Blogs(props) {
  const { location, history } = props;
  const { loading, error, data } = useQuery(BLOGS);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const renderBlogs = (blogs) => {
    return data.blogs.map(({ id, title, body }) => (
      <ListItem key={id}>
        <Link to={`/blog/${id}`}>{title}</Link>
        <Button>
          <Link
            to={{
              pathname: `/blog/edit/${id}`,
              state: { title: title, body: body },
            }}
          >
            Edit
          </Link>
        </Button>
        <Button
          style={{ backgroundColor: 'red', borderColor: 'red' }}
          onClick={(e) => {
            e.preventDefault();
            deleteBlog({ variables: { id } });
            history.push('/blog');
          }}
        >
          Delete
        </Button>
      </ListItem>
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      <Button>
        <Link to="/blog/new" style={{ color: '#fff', textDecoration: 'none' }}>
          New Post
        </Link>
      </Button>
      <List>{renderBlogs(data.blogs)}</List>
    </div>
  );
}
