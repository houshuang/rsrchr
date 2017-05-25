import React, { PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Editor } from 'slate';

// Define our app...
class EditorComp extends React.Component {
  // On change, update the app's React state with the new editor state.
  onChange = state => {
    this.props.store.setText(state);
  };
  onKeyDown = (event, data, state) => {
    if (data.isCtrl) {
      if (data.key === 'j') {
        this.props.store.nextPage();
        event.preventDefault();
      } else if (data.key === 'j') {
        this.props.store.prevPage();
        event.preventDefault();
      } else if (data.key === 'k') {
        this.props.store.prevPage();
        event.preventDefault();
      } else if (data.key === 'p') {
        event.preventDefault();
        const newState = state
          .transform()
          .insertText('\nPage ' + this.props.store.state.page + 1 + ': ')
          .apply();
        return newState;
      }
    }
  };

  // Render the editor.
  render = () => {
    return (
      <Editor
        onKeyDown={this.onKeyDown}
        state={this.props.store.state.text}
        onChange={this.onChange}
      />
    );
  };
}

export default inject('store')(observer(EditorComp));
