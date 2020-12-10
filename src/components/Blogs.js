import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Container } from './shared/Container';
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
  const { history } = props;
  const { loading, error, data } = useQuery(BLOGS);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const renderBlogs = (blogs) => {
    return data.blogs.map(({ id, title, body }) => (
      <ListItem key={id}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: '1',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3>
              <Link to={`/blog/${id}`}>{title}</Link>
            </h3>
            <div>
              <Link
                to={{
                  pathname: `/blog/edit/${id}`,
                  state: { title: title, body: body },
                }}
              >
                <Button>Edit</Button>
              </Link>
              <Button
                style={{
                  backgroundColor: 'red',
                  borderColor: 'red',
                  marginLeft: '10px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  let result = window.confirm(
                    'Are you sure you want to delete?',
                  );
                  if (result) {
                    deleteBlog({ variables: { id } });
                    history.push('/blog');
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          <p>{body}</p>
        </div>
      </ListItem>
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <Container>
      <div>
        <Link
          to="/blog/new"
          style={{
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          <Button>New Post</Button>
        </Link>
        <List style={{ marginTop: '10px' }}>{renderBlogs(data.blogs)}</List>
      </div>
    </Container>
  );
}
