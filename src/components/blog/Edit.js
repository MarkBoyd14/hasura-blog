import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Form, Input, Button } from '../shared/Form';
import {
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
  convertFromHTML,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../App.css';
import { stateToHTML } from 'draft-js-export-html';

const EDIT_BLOG = gql`
  mutation($id: uuid!, $text: json!, $title: String!) {
    update_blogs_by_pk(
      pk_columns: { id: $id }
      _set: { text: $text, title: $title }
    ) {
      id
      title
      text
    }
  }
`;

export default function Edit(props) {
  const { match, location, history } = props;
  const { id } = match.params;
  const [title, setTitle] = useState(location.state.title);
  const markup = stateToHTML(convertFromRaw(location.state.text));
  const blocksFromHTML = convertFromHTML(markup);
  const contentState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(contentState),
  );

  const rawState = convertToRaw(editorState.getCurrentContent());

  const [editBlog] = useMutation(EDIT_BLOG, { variables: { id } });

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          editBlog({ variables: { title: title, text: rawState } });
          history.push('/blog');
        }}
      >
        <label>Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Text</label>
        <Editor
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
