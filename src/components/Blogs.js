import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Container } from './shared/Container';
import { List, ListItem } from './shared/List';
import { Button } from './shared/Form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

export const FETCH_BLOGS = gql`
  {
    blogs {
      id
      title
      body
      text
    }
  }
`;

const CHANGE_INDEX = gql`
  mutation($id: uuid!, $index: Int!) {
    update_blogs_by_pk(pk_columns: { id: $id }, _set: { index: $index }) {
      index
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
  const { loading, error, data } = useQuery(FETCH_BLOGS);
  // const { changeIndex } = useMutation(CHANGE_INDEX);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const [state, setState] = useState(undefined);

  useEffect(() => {
    if (loading === false && data) {
      setState({ blogs: data.blogs });
    }
  }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const reorder = (blogs, startIndex, endIndex) => {
    const result = Array.from(blogs);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const blogs = reorder(
      state.blogs,
      result.source.index,
      result.destination.index,
    );
    setState({ blogs });
  }

  // const updateCache = (client) => {
  //   data.blogs.map(({ id, title, body }) => {
  //     const data = client.readQuery({
  //       query: FETCH_BLOGS,
  //       variables: {
  //         title,
  //         body,
  //       },
  //     });
  //     const newData = {
  //       blogs: data.blogs.filter((t) => t.id !== id),
  //     };
  //     client.writeQuery({
  //       query: FETCH_BLOGS,
  //       variables: {
  //         title,
  //         body,
  //       },
  //       data: newData,
  //     });
  //     return newData;
  //   });
  // };

  const renderBlogs = (blogs) => {
    return blogs.map((blog, index) => (
      <Draggable key={blog.id} draggableId={blog.id} index={index}>
        {(provided) => (
          <ListItem
            key={blog.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
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
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h3>
                <div>
                  <Link
                    to={{
                      pathname: `/blog/edit/${blog.id}`,
                      state: { title: blog.title, text: blog.text },
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
                        deleteBlog({
                          variables: { id: blog.id },
                          // update: updateCache,
                        });
                        history.push('/blog');
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: stateToHTML(convertFromRaw(blog.text)),
                }}
              />
            </div>
          </ListItem>
        )}
      </Draggable>
    ));
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blogs">
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ marginTop: '10px' }}
              >
                {state === undefined ? (
                  <p>Loading...</p>
                ) : (
                  renderBlogs(state.blogs)
                )}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Container>
  );
}
