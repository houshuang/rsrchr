import React from 'react';
import { inject, observer } from 'mobx-react';
import { store } from '../index';
import { Box } from 'react-desktop';

const BibEntry = ({ entry }) => (
  <Box
    onClick={() =>
      store.loadFile('/Users/stian/Dropbox/Bibdesk/' + entry.EntryKey + '.pdf')}
  >
    <b>{entry.EntryKey}</b>: {entry.Fields.Title}
  </Box>
);

const BibList = ({ store: { filteredEntries } }) => (
  <div>
    {filteredEntries.map(x => <BibEntry key={x.EntryKey} entry={x} />)}
  </div>
);

export default inject('store')(observer(BibList));
