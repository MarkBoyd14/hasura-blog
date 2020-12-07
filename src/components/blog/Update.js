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

const UPDATE_BLOG = gql`
  mutation($id: uuid!, $body: String!, $title: String!) {
    update_blogs_by_pk(
      pk_columns: { id: $id }
      _set: { body: $body, title: $title }
    ) {
      body
      id
      title
    }
  }
`;

export default function Update(props) {
  const { id } = props.match.params;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [updateBlog] = useMutation(UPDATE_BLOG, { variables: { id } });

  return (
    <Form
      onSubmit={() => {
        updateBlog({ variables: { title: title, body: body } });
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
