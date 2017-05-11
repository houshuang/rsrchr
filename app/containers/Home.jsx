import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import ReactPDF from 'react-pdf';
import { Editor, Raw } from 'slate';

import styles from './home.css';

const initialState = Raw.deserialize(
  {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'A line of text in a paragraph.'
          }
        ]
      }
    ]
  },
  { terse: true }
);

// Define our app...
class EditorComp extends React.Component {
  // Set the initial state when the app is first constructed.
  state = {
    state: initialState
  };

  // On change, update the app's React state with the new editor state.
  onChange = state => {
    this.setState({ state });
  };

  // Render the editor.
  render = () => {
    return <Editor state={this.state.state} onChange={this.onChange} />;
  };
}
// Home component
const Home = ({ store: { state: { file, page }, files } }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <ReactPDF file={`file:///${file}`} pageIndex={page} />
      </div><div>
        <EditorComp />
      </div>
    </div>
  );
};

export default inject('store')(observer(Home));
