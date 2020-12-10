import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Form, Input, TextArea, Button } from '../shared/Form';

const ADD_BLOG = gql`
  mutation($title: String!, $body: String!) {
    insert_blogs(objects: { title: $title, body: $body }) {
      returning {
        id
        title
        body
      }
    }
  }
`;

export default function New(props) {
  const { history } = props;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [addBlog] = useMutation(ADD_BLOG, {
    update(cache, { data: { addBlog } }) {
      cache.modify({
        fields: {
          blogs(existingBlogs = []) {
            const newBlogRef = cache.writeFragment({
              data: addBlog,
              fragment: gql`
                fragment NewBlog on Blog {
                  id
                  title
                  body
                }
              `,
            });
            return [...existingBlogs, newBlogRef];
          },
        },
      });
    },
  });
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          addBlog({ variables: { title: title, body: body } });
          Input.value = '';
          history.push('/blog');
        }}
      >
        <label>Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '300px' }}
        />
        <label>Body</label>
        <TextArea
          type="text"
          rows="10"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button type="submit" value="submit" style={{ width: '200px' }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
