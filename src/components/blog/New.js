import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { Input, Button } from '../shared/Form';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  > button {
    margin-left: 1rem;
  }
`;

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
  const [addBlog] = useMutation(
    ADD_BLOG,
    // , {
    //   update(cache, { data: { addBlog } }) {
    //     cache.modify({
    //       fields: {
    //         blogs(existingBlogs = []) {
    //           const newBlogRef = cache.writeFragment({
    //             data: addBlog,
    //             fragment: gql`
    //               fragment NewBlog on Blog {
    //                 id
    //                 title
    //                 body
    //               }
    //             `,
    //           });
    //           return [...existingBlogs, newBlogRef];
    //         },
    //       },
    //     });
    //   },
    // }
  );
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        addBlog({ variables: { title: title, body: body } });
        Input.value = '';
        history.push('/blog');
      }}
    >
      <label>Title</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Body</label>
      <Input value={body} onChange={(e) => setBody(e.target.value)} />
      <Button type="submit" value="submit">
        Submit
      </Button>
    </Form>
  );
}
