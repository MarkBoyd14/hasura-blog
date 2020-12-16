import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FETCH_BLOGS } from '../Blogs';
import { Form, Input, Button } from '../shared/Form';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../App.css';

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
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [convertedContent, setConvertedContent] = useState(null);
  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  const [addBlog, { loading, error }] = useMutation(ADD_BLOG);

  const updateCache = (client, { data: { insert_blogs } }) => {
    const data = client.readQuery({
      query: FETCH_BLOGS,
      variables: {
        title,
        body: convertedContent,
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
        body: convertedContent,
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
            variables: { title, body: convertedContent },
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
          onEditorStateChange={handleEditorChange}
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
