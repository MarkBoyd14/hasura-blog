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
  mutation($body: String!, $title: String!) {
    InsertBlogsDerived(body: $body, title: $title) {
      affected_rows
    }
  }
`;

export default function New() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [addBlog] = useMutation(ADD_BLOG);
  return (
    <Form
      onSubmit={() => {
        addBlog({ variables: { title: title, body: body } });
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
