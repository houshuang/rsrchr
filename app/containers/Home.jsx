import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import ReactPDF from 'react-pdf';
import { Box, ProgressCircle, SearchField } from 'react-desktop/macOs';

import BibList from './BibList';
import EditorComp from './EditorComp';

// Home component
const Home = ({ store: { state: { file, page }, files, updateSearch } }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '20%' }}>
        <SearchField onChange={e => updateSearch(e.target.value)} />
        <BibList />
      </div>
      <div style={{ width: '800px' }}>
        <ReactPDF
          width={800}
          file={`file:///${file}`}
          pageIndex={page}
          loading={<ProgressCircle />}
          error={'No PDF loaded'}
        />
      </div><div>
        <Box width="300px" height="800px">
          <EditorComp />
        </Box>
      </div>
    </div>
  );
};

export default inject('store')(observer(Home));
