import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FETCH_BLOGS } from '../Blogs';
import { Form, Input, Button } from '../shared/Form';
import { convertToRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../App.css';

const ADD_BLOG = gql`
  mutation($title: String!, $text: json!) {
    insert_blogs(objects: { title: $title, text: $text }) {
      returning {
        id
        title
        text
      }
    }
  }
`;

export default function New(props) {
  const { history } = props;
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  const rawState = convertToRaw(editorState.getCurrentContent());
  console.log(editorState.getCurrentContent());

  const [addBlog, { loading, error }] = useMutation(ADD_BLOG);

  const updateCache = (client, { data: { insert_blogs } }) => {
    const data = client.readQuery({
      query: FETCH_BLOGS,
      variables: {
        title,
        text: rawState,
      },
    });
    const newBlog = insert_blogs.returning[0];
    const newData = {
      blogs: [newBlog, ...data.blogs],
    };
    client.writeQuery({
      query: FETCH_BLOGS,
      variables: {
        title,
        text: rawState,
      },
      data: newData,
    });
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          addBlog({
            variables: { title, text: rawState },
            update: updateCache,
          });
          Input.value = '';
          history.push('/blog');
        }}
      >
        <label htmlFor="title">Title</label>
        <Input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '300px' }}
        />
        <label htmlFor="body">Body</label>
        <Editor
          name="body"
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
        <Button
          type="submit"
          value="submit"
          style={{ width: '200px', marginTop: '10px' }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
